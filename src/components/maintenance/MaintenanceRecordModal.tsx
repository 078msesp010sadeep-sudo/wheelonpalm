import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { MaintenanceRecord, Vehicle, ServiceCategory } from '../../types';
import { SERVICE_CATEGORIES, formatNpr } from '../../lib/formatters';
import { useAuth } from '../../context/AuthContext';

interface MaintenanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => Promise<void>;
  vehicles: Vehicle[];
  defaultVehicleId?: string;
}

export const MaintenanceRecordModal: React.FC<MaintenanceRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles,
  defaultVehicleId,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ''));
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('general_servicing');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometerReading, setOdometerReading] = useState<number>(0);
  const [workshopName, setWorkshopName] = useState('');
  const [description, setDescription] = useState('');
  const [partsInput, setPartsInput] = useState('');
  const [labourCostNpr, setLabourCostNpr] = useState<number>(1000);
  const [partsCostNpr, setPartsCostNpr] = useState<number>(2000);
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [nextServiceOdometer, setNextServiceOdometer] = useState<number>(0);

  useEffect(() => {
    if (defaultVehicleId) {
      setVehicleId(defaultVehicleId);
      const selected = vehicles.find((v) => v.id === defaultVehicleId);
      if (selected) {
        setOdometerReading(selected.currentOdometer);
        setNextServiceOdometer(selected.currentOdometer + 5000);
      }
    } else if (vehicles.length > 0) {
      setVehicleId(vehicles[0].id);
      setOdometerReading(vehicles[0].currentOdometer);
      setNextServiceOdometer(vehicles[0].currentOdometer + 5000);
    }
    setError(null);
  }, [defaultVehicleId, vehicles, isOpen]);

  const handleVehicleChange = (vId: string) => {
    setVehicleId(vId);
    const selected = vehicles.find((v) => v.id === vId);
    if (selected) {
      setOdometerReading(selected.currentOdometer);
      setNextServiceOdometer(selected.currentOdometer + 5000);
    }
  };

  const totalCost = (Number(labourCostNpr) || 0) + (Number(partsCostNpr) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      setError('Please select a registered vehicle.');
      return;
    }
    if (!workshopName.trim() || !description.trim()) {
      setError('Please enter the workshop name and work description.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const partsArray = partsInput
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      await onSave({
        vehicleId,
        userId: user?.uid || 'demo-user-123',
        serviceCategory,
        serviceDate,
        odometerReading: Number(odometerReading) || 0,
        workshopName: workshopName.trim(),
        description: description.trim(),
        partsReplaced: partsArray,
        labourCostNpr: Number(labourCostNpr) || 0,
        partsCostNpr: Number(partsCostNpr) || 0,
        totalCostNpr: totalCost,
        nextServiceDate: nextServiceDate || undefined,
        nextServiceOdometer: nextServiceOdometer ? Number(nextServiceOdometer) : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save maintenance record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Maintenance & Service Visit"
      subtitle="Keep an auditable digital service history for warranty and vehicle resale value."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Vehicle Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              Service Category *
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Odometer, Workshop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service Date *
            </label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Odometer Reading (km) *
            </label>
            <input
              type="number"
              min="0"
              value={odometerReading}
              onChange={(e) => setOdometerReading(parseInt(e.target.value, 10) || 0)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workshop / Service Center *
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Motors, Tinkune"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Description of work */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Work Performed & Diagnostic Details *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Engine oil replaced with Castrol 5W30, front brake pads cleaned, wheel alignment adjusted."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Parts Replaced */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Parts & Consumables Replaced (Comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Oil Filter, Air Filter, Synthetic Oil 4L, Spark Plugs"
            value={partsInput}
            onChange={(e) => setPartsInput(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Costs in NPR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Labour Charges (NPR)
            </label>
            <input
              type="number"
              min="0"
              value={labourCostNpr}
              onChange={(e) => setLabourCostNpr(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Parts Cost (NPR)
            </label>
            <input
              type="number"
              min="0"
              value={partsCostNpr}
              onChange={(e) => setPartsCostNpr(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-xs font-semibold text-slate-700 mb-1">Total Bill Amount</span>
            <div className="h-10 px-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center font-bold text-teal-800 text-sm tabular-nums">
              {formatNpr(totalCost)}
            </div>
          </div>
        </div>

        {/* Next Service Reminders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Next Due Service Date (Optional)
            </label>
            <input
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Next Due Odometer Target (km)
            </label>
            <input
              type="number"
              min="0"
              value={nextServiceOdometer}
              onChange={(e) => setNextServiceOdometer(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
            />
          </div>
        </div>

        {/* Actions */}
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
            {loading ? 'Logging Service...' : 'Save Maintenance Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
