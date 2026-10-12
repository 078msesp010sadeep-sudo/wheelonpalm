import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/garage/VehicleCard';
import { VehicleModal } from '../components/garage/VehicleModal';
import { VehicleDetailModal } from '../components/garage/VehicleDetailModal';
import { MaintenanceRecordModal } from '../components/maintenance/MaintenanceRecordModal';
import { DocumentModal } from '../components/documents/DocumentModal';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { VehicleListingModal } from '../components/marketplace/VehicleListingModal';
import { Plus, Car, Filter, Search, Bike } from 'lucide-react';

export const GaragePage: React.FC = () => {
  const { 
    userVehicles, 
    maintenanceRecords, 
    documents, 
    providers, 
    addVehicle, 
    updateVehicle, 
    deleteVehicle, 
    addMaintenanceRecord, 
    addDocument, 
    createBooking 
  } = useData();

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [vehicleToList, setVehicleToList] = useState<Vehicle | null>(null);
  
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeVehicleForAction, setActiveVehicleForAction] = useState<Vehicle | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = userVehicles.filter((v) => {
    const matchesType = filterType === 'all' || v.vehicleType === filterType;
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenAdd = () => {
    setVehicleToEdit(null);
    setIsVehicleModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle and its associated records?')) {
      await deleteVehicle(id);
    }
  };

  const handleBookService = (vehicle: Vehicle) => {
    setActiveVehicleForAction(vehicle);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Digital Garage
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your motorcycles, cars, EVs, and commercial vehicles with Nepal DOTM compliance.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Register Vehicle</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by make, model, or plate #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['all', 'car', 'suv', 'motorcycle', 'scooter', 'ev'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
                  filterType === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No vehicles match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your two-wheeler or four-wheeler to keep its maintenance logs and bluebook expiry on schedule.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(v) => setDetailVehicle(v)}
                onBookService={handleBookService}
                onListMarketplace={(v) => {
                  setVehicleToList(v);
                  setIsListingModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        vehicleToEdit={vehicleToEdit}
        onSave={async (data) => {
          if (vehicleToEdit) {
            await updateVehicle(vehicleToEdit.id, data);
          } else {
            await addVehicle(data);
          }
        }}
      />

      <VehicleDetailModal
        isOpen={Boolean(detailVehicle)}
        onClose={() => setDetailVehicle(null)}
        vehicle={detailVehicle}
        records={maintenanceRecords}
        documents={documents}
        onAddMaintenance={(v) => {
          setActiveVehicleForAction(v);
          setIsMaintenanceModalOpen(true);
        }}
        onAddDocument={(v) => {
          setActiveVehicleForAction(v);
          setIsDocumentModalOpen(true);
        }}
      />

      <MaintenanceRecordModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        vehicles={userVehicles}
        defaultVehicleId={activeVehicleForAction?.id}
        onSave={async (rec) => {
          await addMaintenanceRecord(rec);
        }}
      />

      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        vehicles={userVehicles}
        defaultVehicleId={activeVehicleForAction?.id}
        onSave={async (doc) => {
          await addDocument(doc);
        }}
      />

      <BookingWizardModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicles={userVehicles}
        providers={providers}
        defaultVehicleId={activeVehicleForAction?.id}
        onSubmitBooking={createBooking}
      />

      <VehicleListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setVehicleToList(null);
        }}
        initialVehicle={vehicleToList}
      />
    </div>
  );
};
