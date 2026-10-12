import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Vehicle, VehicleType, FuelType } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  vehicleToEdit?: Vehicle | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicleToEdit,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [manufactureYear, setManufactureYear] = useState<number>(new Date().getFullYear());
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [currentOdometer, setCurrentOdometer] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setVehicleType(vehicleToEdit.vehicleType);
      setMake(vehicleToEdit.make);
      setModel(vehicleToEdit.model);
      setManufactureYear(vehicleToEdit.manufactureYear);
      setRegistrationNumber(vehicleToEdit.registrationNumber);
      setChassisNumber(vehicleToEdit.chassisNumber || '');
      setEngineNumber(vehicleToEdit.engineNumber || '');
      setFuelType(vehicleToEdit.fuelType);
      setCurrentOdometer(vehicleToEdit.currentOdometer);
      setPurchaseDate(vehicleToEdit.purchaseDate || '');
      setNotes(vehicleToEdit.notes || '');
    } else {
      setVehicleType('car');
      setMake('');
      setModel('');
      setManufactureYear(new Date().getFullYear());
      setRegistrationNumber('');
      setChassisNumber('');
      setEngineNumber('');
      setFuelType('petrol');
      setCurrentOdometer(0);
      setPurchaseDate('');
      setNotes('');
    }
    setError(null);
  }, [vehicleToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !registrationNumber.trim()) {
      setError('Please provide vehicle make, model, and registration number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        ownerId: user?.uid || 'demo-user-123',
        vehicleType,
        make: make.trim(),
        model: model.trim(),
        manufactureYear: Number(manufactureYear) || new Date().getFullYear(),
        registrationNumber: registrationNumber.trim(),
        chassisNumber: chassisNumber.trim() || undefined,
        engineNumber: engineNumber.trim() || undefined,
        fuelType,
        currentOdometer: Number(currentOdometer) || 0,
        odometerUnit: 'km',
        purchaseDate: purchaseDate || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? 'Edit Vehicle Details' : 'Register New Vehicle'}
      subtitle="Keep your vehicle profile accurate for maintenance logs & bluebook renewals."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Vehicle Classification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vehicle Type *
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="motorcycle">Motorcycle</option>
              <option value="scooter">Scooter</option>
              <option value="car">Car (Sedan / Hatchback)</option>
              <option value="suv">SUV / Crossover</option>
              <option value="ev">Electric Vehicle (EV)</option>
              <option value="commercial">Commercial / Truck</option>
              <option value="other">Other Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Powertrain / Fuel *
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">100% Electric (EV)</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Make / Manufacturer *
            </label>
            <input
              type="text"
              placeholder="e.g. Hyundai, Bajaj, BYD"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model *
            </label>
            <input
              type="text"
              placeholder="e.g. Creta, Pulsar 220, Atto 3"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Manufacture Year *
            </label>
            <input
              type="number"
              min="1980"
              max={new Date().getFullYear() + 1}
              value={manufactureYear}
              onChange={(e) => setManufactureYear(parseInt(e.target.value, 10))}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
          </div>
        </div>

        {/* Nepal Registration Number & Odometer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nepal Registration Plate Number *
            </label>
            <input
              type="text"
              placeholder="e.g. Ba 2 Cha 8891 or Bagmati 01-025 Cha 1122"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              As written on your DOTM Bluebook.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Odometer Reading (km) *
            </label>
            <input
              type="number"
              min="0"
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(parseInt(e.target.value, 10) || 0)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Helps schedule timely periodic maintenance.
            </span>
          </div>
        </div>

        {/* Sensitive Numbers (Masked for privacy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chassis / VIN Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. MALC381CLPM019283"
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Masked on public cards for cybersecurity.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Engine Number / Motor ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. G4FLNP918234"
              value={engineNumber}
              onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Purchase Date & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Purchase Date (Optional)
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Personal Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Company lease, spare key at home, alloy wheels"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : vehicleToEdit ? 'Update Vehicle' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
