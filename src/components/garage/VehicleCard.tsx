import React from 'react';
import { 
  Car, 
  Bike, 
  Zap, 
  Fuel, 
  Calendar, 
  Gauge, 
  FileText, 
  Wrench, 
  Edit3, 
  Trash2,
  Eye
} from 'lucide-react';
import { Vehicle } from '../../types';
import { maskSensitiveId } from '../../lib/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView: (vehicle: Vehicle) => void;
  onBookService: (vehicle: Vehicle) => void;
  onListMarketplace?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
  onView,
  onBookService,
  onListMarketplace,
}) => {
  const getVehicleIcon = () => {
    switch (vehicle.vehicleType) {
      case 'motorcycle':
      case 'scooter':
        return Bike;
      case 'ev':
        return Zap;
      default:
        return Car;
    }
  };

  const Icon = getVehicleIcon();

  const fuelLabels: Record<string, string> = {
    petrol: 'Petrol',
    diesel: 'Diesel',
    electric: '100% Electric',
    hybrid: 'Hybrid Petrol',
    cng: 'CNG',
    other: 'Other',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs hover:shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Header Card */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              vehicle.vehicleType === 'ev' 
                ? 'bg-emerald-50 text-emerald-600' 
                : vehicle.vehicleType === 'motorcycle' || vehicle.vehicleType === 'scooter'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-slate-100 text-slate-700'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {vehicle.make} {vehicle.model}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{vehicle.registrationNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{vehicle.manufactureYear}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(vehicle)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Edit vehicle details"
              aria-label="Edit vehicle"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete vehicle"
              aria-label="Delete vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specifications & Metrics */}
        <div className="p-5 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>Odometer</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 tabular-nums">
              {vehicle.currentOdometer.toLocaleString()} {vehicle.odometerUnit}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>Powertrain</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {fuelLabels[vehicle.fuelType] || vehicle.fuelType}
            </p>
          </div>

          <div className="col-span-2 pt-1 border-t border-slate-100/60 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Chassis: <code className="font-mono text-slate-700">{maskSensitiveId(vehicle.chassisNumber)}</code></span>
            <span>Engine: <code className="font-mono text-slate-700">{maskSensitiveId(vehicle.engineNumber)}</code></span>
          </div>
        </div>
      </div>

      {/* Card Action Footers */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => onView(vehicle)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-2">
          {onListMarketplace && (
            <button
              onClick={() => onListMarketplace(vehicle)}
              className="text-xs font-semibold text-slate-800 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shadow-2xs"
            >
              <Bike className="w-3.5 h-3.5 text-amber-600" />
              <span>Rent / Sell</span>
            </button>
          )}

          <button
            onClick={() => onBookService(vehicle)}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5 text-teal-600" />
            <span>Service</span>
          </button>
        </div>
      </div>
    </div>
  );
};
