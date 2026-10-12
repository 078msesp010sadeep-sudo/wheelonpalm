import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Vehicle, MaintenanceRecord, VehicleDocument } from '../../types';
import { formatNpr, formatNepaliDate, maskSensitiveId, calculateExpiryStatus } from '../../lib/formatters';
import { Eye, EyeOff, Wrench, FileText, Calendar, Fuel, Shield, AlertCircle } from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  records: MaintenanceRecord[];
  documents: VehicleDocument[];
  onAddMaintenance: (vehicle: Vehicle) => void;
  onAddDocument: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  records,
  documents,
  onAddMaintenance,
  onAddDocument,
}) => {
  const [revealSensitive, setRevealSensitive] = useState(false);

  if (!vehicle) return null;

  const vehicleRecords = records.filter((r) => r.vehicleId === vehicle.id);
  const vehicleDocs = documents.filter((d) => d.vehicleId === vehicle.id);
  const totalSpent = vehicleRecords.reduce((acc, r) => acc + (r.totalCostNpr || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.make} ${vehicle.model} (${vehicle.manufactureYear})`}
      subtitle={`Plate: ${vehicle.registrationNumber} · Digital Garage File`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Odometer</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {vehicle.currentOdometer.toLocaleString()} km
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Powertrain</span>
            <span className="text-sm font-bold text-slate-900 capitalize">
              {vehicle.fuelType}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Maintenance Records</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {vehicleRecords.length} logged
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Total Lifetime Cost</span>
            <span className="text-sm font-bold text-teal-700 tabular-nums">
              {formatNpr(totalSpent)}
            </span>
          </div>
        </div>

        {/* Security & Serial Numbers Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Vehicle Identifiers (Nepal DOTM)
              </h4>
            </div>
            <button
              onClick={() => setRevealSensitive(!revealSensitive)}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              {revealSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealSensitive ? 'Mask IDs' : 'Reveal IDs'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Chassis / VIN</span>
              <span className="font-mono text-white text-xs select-all">
                {revealSensitive ? vehicle.chassisNumber || 'Not provided' : maskSensitiveId(vehicle.chassisNumber)}
              </span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Engine Number</span>
              <span className="font-mono text-white text-xs select-all">
                {revealSensitive ? vehicle.engineNumber || 'Not provided' : maskSensitiveId(vehicle.engineNumber)}
              </span>
            </div>
          </div>
        </div>

        {/* Document Status Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Official Documents & Expiries ({vehicleDocs.length})
              </h4>
            </div>
            <button
              onClick={() => onAddDocument(vehicle)}
              className="text-xs font-medium text-teal-600 hover:text-teal-700 underline"
            >
              + Add Document
            </button>
          </div>

          {vehicleDocs.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
              No bluebook, tax, or insurance documents uploaded for this vehicle yet.
            </p>
          ) : (
            <div className="space-y-2">
              {vehicleDocs.map((doc) => {
                const expiry = calculateExpiryStatus(doc.expiryDate);
                return (
                  <div
                    key={doc.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500">
                        Ref: {doc.referenceNumber} · Exp: {formatNepaliDate(doc.expiryDate)}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${expiry.badgeClass}`}>
                      {expiry.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Service History Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Maintenance History ({vehicleRecords.length})
              </h4>
            </div>
            <button
              onClick={() => onAddMaintenance(vehicle)}
              className="text-xs font-medium text-teal-600 hover:text-teal-700 underline"
            >
              + Log Service
            </button>
          </div>

          {vehicleRecords.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
              No service visits recorded yet. Log your first oil change or periodic inspection.
            </p>
          ) : (
            <div className="space-y-2.5">
              {vehicleRecords.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{rec.workshopName}</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatNpr(rec.totalCostNpr)}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{rec.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                    <span>{formatNepaliDate(rec.serviceDate)}</span>
                    <span>·</span>
                    <span className="tabular-nums">{rec.odometerReading.toLocaleString()} km</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
