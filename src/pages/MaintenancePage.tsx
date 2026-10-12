import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MaintenanceRecordModal } from '../components/maintenance/MaintenanceRecordModal';
import { formatNpr, formatNepaliDate, SERVICE_CATEGORIES } from '../lib/formatters';
import { Wrench, Plus, Filter, Search, Calendar, Gauge, Trash2, FileText, CheckCircle2 } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { userVehicles, maintenanceRecords, addMaintenanceRecord, deleteMaintenanceRecord } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = maintenanceRecords
    .filter((r) => {
      const matchesVeh = selectedVehicleFilter === 'all' || r.vehicleId === selectedVehicleFilter;
      const matchesCat = selectedCategoryFilter === 'all' || r.serviceCategory === selectedCategoryFilter;
      const matchesSearch = 
        r.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.partsReplaced.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesVeh && matchesCat && matchesSearch;
    })
    .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());

  const totalSpent = filteredRecords.reduce((acc, r) => acc + (r.totalCostNpr || 0), 0);
  const totalLabour = filteredRecords.reduce((acc, r) => acc + (r.labourCostNpr || 0), 0);
  const totalParts = filteredRecords.reduce((acc, r) => acc + (r.partsCostNpr || 0), 0);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this maintenance record from history?')) {
      await deleteMaintenanceRecord(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Maintenance & Service Records
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Chronological log of periodic servicing, oil changes, parts replacements, and workshop invoices.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Log Maintenance Visit</span>
          </button>
        </div>

        {/* Cost Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 block">Total Maintenance Spend</span>
            <p className="text-2xl font-bold text-teal-700 tabular-nums mt-1">
              {formatNpr(totalSpent)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Across {filteredRecords.length} recorded service sessions
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 block">Total Replacement Parts</span>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {formatNpr(totalParts)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Filters, oils, brake pads, consumables
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 block">Total Labour & Bay Charges</span>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {formatNpr(totalLabour)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Mechanic diagnostics and servicing fee
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search workshop, description, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Vehicle Dropdown Filter */}
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Vehicles</option>
              {userVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Service Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline Records List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No service records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Log your oil change, tuneup, or periodic inspection to preserve vehicle resale valuation.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Log Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const matchedVeh = userVehicles.find((v) => v.id === record.vehicleId);
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {record.workshopName}
                      </span>
                      {matchedVeh && (
                        <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                          {matchedVeh.make} {matchedVeh.model} ({matchedVeh.registrationNumber})
                        </span>
                      )}
                      <span className="text-xs text-slate-500">· {formatNepaliDate(record.serviceDate)}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {record.description}
                    </p>

                    {/* Parts list */}
                    {record.partsReplaced && record.partsReplaced.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 pt-1">
                        <span className="font-medium text-slate-600">Replaced:</span>
                        {record.partsReplaced.map((part, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                            {part}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Next service reminder note */}
                    {(record.nextServiceDate || record.nextServiceOdometer) && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        {record.nextServiceDate && (
                          <span>Next due date: <strong>{formatNepaliDate(record.nextServiceDate)}</strong></span>
                        )}
                        {record.nextServiceOdometer && (
                          <span>Target Odometer: <strong className="tabular-nums">{record.nextServiceOdometer.toLocaleString()} km</strong></span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block">Total Billed</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {formatNpr(record.totalCostNpr)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Parts: {formatNpr(record.partsCostNpr)} · Labour: {formatNpr(record.labourCostNpr)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MaintenanceRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={userVehicles}
        onSave={async (rec) => {
          await addMaintenanceRecord(rec);
        }}
      />
    </div>
  );
};
