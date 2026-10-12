import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { EmergencyType, EmergencyRequest, Vehicle } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Truck, 
  BatteryCharging, 
  Disc, 
  Fuel, 
  Key, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { NEPAL_EMERGENCY_CONTACTS } from '../../lib/formatters';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSubmitSos: (sos: Omit<EmergencyRequest, 'id' | 'sosRef' | 'status' | 'createdAt'>) => Promise<string>;
}

const EMERGENCY_TYPES: { type: EmergencyType; label: string; icon: any; desc: string }[] = [
  { type: 'tire_puncture', label: 'Tire Puncture / Flat Wheel', icon: Disc, desc: 'On-site puncture plug, tire replacement, jammed lug nut' },
  { type: 'battery_jump_start', label: 'Battery Jump-Start / Dead Cell', icon: BatteryCharging, desc: 'Heavy-duty 12V/24V booster pack dispatch' },
  { type: 'towing', label: 'Flatbed Towing Truck', icon: Truck, desc: 'Hydraulic lift recovery to nearest verified workshop' },
  { type: 'breakdown', label: 'Engine Stalled / Mechanical Breakdown', icon: AlertTriangle, desc: 'Overheating, radiator leak, belt snapped, no start' },
  { type: 'ev_support', label: 'EV High-Voltage Roadside Rescue', icon: BatteryCharging, desc: 'Mobile emergency EV charging / towing' },
  { type: 'fuel_delivery', label: 'Emergency Petrol / Diesel Delivery', icon: Fuel, desc: 'Fuel container delivery in Ring Road corridor' },
  { type: 'lockout', label: 'Vehicle Lockout / Keys Trapped', icon: Key, desc: 'Damage-free door unlock assistance' },
  { type: 'mechanical_emergency', label: 'Other Highway Emergency', icon: Wrench, desc: 'Suspension break, fluid dump, clutch cable failure' },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSubmitSos,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('tire_puncture');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [locationAddress, setLocationAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please enter street location manually.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationAddress(`GPS Coordinates (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) - Kathmandu Region`);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError('Location access denied. Please type your exact landmark or road intersection below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim() || !locationAddress.trim() || !description.trim()) {
      setError('Please provide contact phone, exact breakdown location, and issue description.');
      return;
    }
    if (!consentAcknowledged) {
      setError('Please acknowledge that WheelOnPalm alerts nearby technicians but does not replace national emergency services.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const selectedVeh = vehicles.find((v) => v.id === selectedVehicleId);
      const vehicleSummary = selectedVeh 
        ? `${selectedVeh.make} ${selectedVeh.model} (${selectedVeh.registrationNumber})`
        : 'Registered Vehicle';

      const sosRef = await onSubmitSos({
        userId: user?.uid || 'demo-user-123',
        userName: user?.fullName || 'Vehicle Owner',
        contactPhone: contactPhone.trim(),
        vehicleId: selectedVeh?.id,
        vehicleSummary,
        emergencyType,
        description: description.trim(),
        locationAddress: locationAddress.trim(),
        latitude,
        longitude,
      });

      setConfirmedRef(sosRef);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch SOS alert.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedRef(null);
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={confirmedRef ? 'Roadside Assistance Dispatched' : '24/7 Emergency Roadside Assistance'}
      subtitle={confirmedRef ? 'Your request has alerted authorized roadside responders.' : 'Fast response for breakdown, towing, jump-start & punctures in Nepal.'}
      maxWidth="2xl"
    >
      {confirmedRef ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border-2 border-red-200 animate-pulse">
            <Truck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Emergency Dispatch Reference
            </span>
            <h2 className="text-2xl font-bold font-mono text-red-600 mt-0.5">
              {confirmedRef}
            </h2>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl text-left text-xs space-y-2 border border-slate-800 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Type:</span>
              <span className="font-semibold text-white capitalize">{emergencyType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">{locationAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Callback Phone:</span>
              <span className="font-semibold text-white">{contactPhone}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-teal-400">
              <span>Status:</span>
              <span className="font-bold">Responder Alert Broadcast</span>
            </div>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-[11px] text-red-900 space-y-1 max-w-md mx-auto">
            <span className="font-bold block">Critical Safety Reminder:</span>
            <span>
              If you are stranded in active traffic, turn on vehicle hazard lights immediately and stand behind safety barriers. For physical collision or medical distress, call Traffic Police (103) or Police (100) directly.
            </span>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Track in Emergency Console
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Emergency Helplines Notice */}
          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-900">
                Nepal Immediate Emergency Helplines:
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {NEPAL_EMERGENCY_CONTACTS.map((c) => (
                <div key={c.number} className="bg-white/80 p-1.5 rounded-lg border border-red-100">
                  <span className="text-slate-500 block truncate">{c.name}</span>
                  <a href={`tel:${c.number}`} className="font-bold text-red-700 hover:underline">
                    Dial {c.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. What assistance do you need? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {EMERGENCY_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setEmergencyType(t.type)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      emergencyType === t.type
                        ? 'border-red-500 bg-red-50/60 ring-1 ring-red-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${emergencyType === t.type ? 'text-red-600' : 'text-slate-500'}`} />
                    <div>
                      <span className="font-bold text-slate-900 block">{t.label}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vehicle Stranded *
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Phone for Dispatcher *
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Current Breakdown Location & Landmark *
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 disabled:opacity-50"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{locating ? 'Reading GPS...' : 'Use My GPS Location'}</span>
              </button>
            </div>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g. Ring Road near Kalanki Underpass, or Prithvi Highway Malekhu"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Describe the situation (e.g. front tire popped, smoke from hood, locked outside) *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Please provide details to help responders bring the right tools or towing rig."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Consent and Disclaimer Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-slate-600 leading-snug">
                I understand that submitting this request broadcasts an emergency dispatch notice to verified automotive mechanics in my sector. <strong>It does not guarantee immediate rescue or medical emergency response.</strong> In life-threatening emergencies, I will dial 100 or 103.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{loading ? 'Dispatching...' : 'Broadcast Emergency SOS'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
