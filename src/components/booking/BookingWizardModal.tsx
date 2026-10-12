import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { 
  Vehicle, 
  ServiceProvider, 
  ServiceCategory, 
  ServiceBooking 
} from '../../types';
import { SERVICE_CATEGORIES, formatNpr } from '../../lib/formatters';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, MapPin, Phone, Calendar, Clock, Car, Shield, AlertCircle } from 'lucide-react';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  providers: ServiceProvider[];
  onSubmitBooking: (booking: Omit<ServiceBooking, 'id' | 'bookingRef' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  defaultVehicleId?: string;
  defaultProviderId?: string;
}

const TIME_SLOTS = [
  '08:30 AM - 10:30 AM',
  '10:30 AM - 12:30 PM',
  '01:30 PM - 03:30 PM',
  '03:30 PM - 05:30 PM',
  '05:30 PM - 07:00 PM',
];

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  providers,
  onSubmitBooking,
  defaultVehicleId,
  defaultProviderId,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ''));
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('general_servicing');
  const [selectedProviderId, setSelectedProviderId] = useState(defaultProviderId || (providers[0]?.id || ''));
  
  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [preferredDate, setPreferredDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[1]);
  
  // Logistics
  const [bookingType, setBookingType] = useState<'workshop_visit' | 'pickup_drop'>('workshop_visit');
  const [pickupAddress, setPickupAddress] = useState(user?.address || 'Kathmandu');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [problemDescription, setProblemDescription] = useState('');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const selectedProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const categoryMeta = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory) || SERVICE_CATEGORIES[0];

  const estimatedTotal = (categoryMeta.estMinNpr || 2000) + (bookingType === 'pickup_drop' ? 500 : 0);

  const handleNext = () => {
    if (step === 1 && !selectedVehicle) {
      setError('Please select or register a vehicle first.');
      return;
    }
    if (step === 2 && !selectedProvider) {
      setError('Please select an authorized service center.');
      return;
    }
    setError(null);
    setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = async () => {
    if (!problemDescription.trim()) {
      setError('Please provide a brief description of the required work or issue.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ref = await onSubmitBooking({
        userId: user?.uid || 'demo-user-123',
        customerName: user?.fullName || 'Vehicle Owner',
        customerPhone: customerPhone.trim(),
        vehicleId: selectedVehicle.id,
        vehicleSummary: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.registrationNumber})`,
        providerId: selectedProvider.id,
        providerName: selectedProvider.businessName,
        serviceCategory: selectedCategory,
        bookingType,
        preferredDate,
        preferredTimeSlot: preferredSlot,
        problemDescription: problemDescription.trim(),
        pickupAddress: bookingType === 'pickup_drop' ? pickupAddress.trim() : undefined,
        estimatedCostNpr: estimatedTotal,
      });

      setConfirmedRef(ref);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit appointment reservation.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedRef(null);
    setStep(1);
    setProblemDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={confirmedRef ? 'Booking Confirmed!' : 'Book Vehicle Maintenance Service'}
      subtitle={confirmedRef ? 'Your appointment slot is reserved.' : `Step ${step} of 4: Reserve verified workshop or home pickup in Nepal`}
      maxWidth="2xl"
    >
      {confirmedRef ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Booking Reference
            </span>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
              {confirmedRef}
            </h2>
          </div>

          <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Workshop:</span>
              <span className="font-semibold text-slate-900">{selectedProvider.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-900">{categoryMeta.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Schedule:</span>
              <span className="font-semibold text-slate-900">{preferredDate} · {preferredSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mode:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {bookingType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Estimated Price:</span>
              <span className="font-bold text-teal-700">{formatNpr(estimatedTotal)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The service advisor will review your vehicle request and prepare the inspection bay. You can track or modify this in your Bookings tab.
          </p>

          <button
            onClick={handleResetAndClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            View in My Bookings
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Step 1: Vehicle & Category */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Select Registered Vehicle *
                </label>
                {vehicles.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs">
                    No vehicles found in your garage. Please register a vehicle first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicles.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedVehicleId === v.id
                            ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="font-bold text-slate-900 text-xs block">
                          {v.make} {v.model}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Plate: {v.registrationNumber} · {v.currentOdometer.toLocaleString()} km
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Choose Service Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-medium text-slate-800">{cat.label}</span>
                      <span className="text-[11px] text-teal-700 font-semibold tabular-nums">
                        From {formatNpr(cat.estMinNpr)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Workshop Selection */}
          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Approved Service Center *
              </label>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProviderId(p.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      selectedProviderId === p.id
                        ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.businessName}</span>
                          {p.isVerified && (
                            <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-0.5">
                              <Shield className="w-3 h-3 text-teal-600" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.address}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900">★ {p.rating}</span>
                        <span className="text-[10px] text-slate-400 block">({p.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-1">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date, Time & Mode */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time Window *
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Method: Visit vs Pickup/Drop */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Service Delivery Option *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingType('workshop_visit')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bookingType === 'workshop_visit'
                        ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-xs block">
                      Self Drive to Workshop
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Drop off your vehicle directly at {selectedProvider?.businessName}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('pickup_drop')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bookingType === 'pickup_drop'
                        ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs block">
                        Valet Pickup & Return
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-semibold">
                        +NPR 500
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Verified driver collects vehicle from your doorstep
                    </span>
                  </button>
                </div>
              </div>

              {bookingType === 'pickup_drop' && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Pickup & Return Address in Kathmandu Valley *
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. House 42, Maitidevi Chowk, Kathmandu"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Issue Description & Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe Symptoms, Work Required or Custom Instructions *
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  required
                  placeholder="e.g. Engine feels sluggish when climbing steep slope, brake pads vibrating slightly, periodic synthetic oil replacement requested."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Driver / Owner Contact Phone *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              {/* Estimate Summary Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-teal-400">Order Summary</span>
                  <span className="text-[11px] text-slate-400">Indicative Estimate</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Vehicle:</span>
                  <span className="font-medium text-white">{selectedVehicle?.make} {selectedVehicle?.model}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Service Bay:</span>
                  <span className="font-medium text-white">{selectedProvider?.businessName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Inspection & Base Labour:</span>
                  <span className="tabular-nums">{formatNpr(categoryMeta.estMinNpr)}</span>
                </div>
                {bookingType === 'pickup_drop' && (
                  <div className="flex justify-between text-slate-300">
                    <span>Doorstep Valet Pickup & Drop:</span>
                    <span className="tabular-nums">NPR 500</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-teal-300">
                  <span>Estimated Total:</span>
                  <span className="tabular-nums">{formatNpr(estimatedTotal)}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * Note: Clearly labeled as an initial estimate. Final costs may vary if additional parts or fluids are authorized after physical workshop inspection.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Reserving...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
