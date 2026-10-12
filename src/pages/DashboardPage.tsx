import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ShoppingBag, 
  Plus, 
  ArrowRight,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Truck,
  Award,
  Mountain,
  Bike,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatNpr, formatNepaliDate, calculateExpiryStatus } from '../lib/formatters';
import { VehicleModal } from '../components/garage/VehicleModal';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { EmergencyModal } from '../components/sos/EmergencyModal';
import { EmailVerificationBanner } from '../components/common/EmailVerificationBanner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    userVehicles, 
    maintenanceRecords, 
    documents, 
    userBookings, 
    userEmergencyRequests,
    providers, 
    spareParts,
    addVehicle,
    createBooking,
    createEmergencyRequest 
  } = useData();

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // Computed alerts
  const expiringDocs = documents.map((d) => ({
    ...d,
    expiryCalc: calculateExpiryStatus(d.expiryDate),
  })).filter((d) => d.expiryCalc.daysRemaining <= 30);

  const activeBookings = userBookings.filter((b) => 
    b.status === 'pending' || b.status === 'accepted' || b.status === 'scheduled' || b.status === 'in_progress'
  );

  const activeSos = userEmergencyRequests.filter((s) => s.status !== 'resolved' && s.status !== 'cancelled');

  const recentServices = [...maintenanceRecords].sort((a, b) => 
    new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
  ).slice(0, 4);

  const featuredParts = spareParts.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <EmailVerificationBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Greeting Strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Namaste, {user?.fullName?.split(' ')[0] || 'Driver'} 👋
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                Asia/Kathmandu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Your vehicles, renewal deadlines, and scheduled workshop services are up to date.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS Rescue</span>
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-teal-400" />
              <span>Book Service</span>
            </button>

            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="px-3 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
              title="Add vehicle to digital garage"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Active Emergency SOS Banner (If active) */}
        {activeSos.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-900 block">
                  ACTIVE ROADSIDE DISPATCH: {activeSos[0].sosRef}
                </span>
                <p className="text-xs text-red-700 mt-0.5">
                  Type: {activeSos[0].emergencyType.replace('_', ' ')} · Location: {activeSos[0].locationAddress}
                </p>
              </div>
            </div>
            <Link
              to="/sos"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold text-center whitespace-nowrap"
            >
              Open Live Tracker
            </Link>
          </div>
        )}

        {/* 50-Year Master Automobile Entrepreneur Feature Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                50-Year Master Automotive Intelligence
              </span>
              <span className="text-xs text-slate-400">· उस्तादजी (Ustad-Ji) Diagnostics</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Himalayan Duty-Cycle Wear & Resale Equity Auditor
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Model mountain downhill brake fluid boiling, Kathmandu dust oil breakdown, and generate an official Nepal Resale Provenance Certificate for your vehicles.
            </p>
          </div>

          <Link
            to="/intelligence"
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
          >
            <span>Launch Diagnostics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* High-Level Overview Metrics (Tabular Numerals) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/garage"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Digital Garage</span>
              <Car className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {userVehicles.length}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Registered vehicle profiles
            </span>
          </Link>

          <Link
            to="/documents"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Bluebook & Tax Alerts</span>
              <FileText className={`w-4 h-4 ${expiringDocs.length > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {expiringDocs.length}
            </p>
            <span className={`text-[11px] mt-1 block ${expiringDocs.length > 0 ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
              {expiringDocs.length > 0 ? 'Expiring in < 30 days!' : 'All documents valid'}
            </span>
          </Link>

          <Link
            to="/bookings"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Active Bookings</span>
              <Calendar className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {activeBookings.length}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {activeBookings.length > 0 ? 'Scheduled workshop bay' : 'No pending reservations'}
            </span>
          </Link>

          <Link
            to="/maintenance"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Lifetime Service Spend</span>
              <Wrench className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-teal-700 tabular-nums">
              {formatNpr(maintenanceRecords.reduce((acc, r) => acc + (r.totalCostNpr || 0), 0))}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {maintenanceRecords.length} recorded visits
            </span>
          </Link>
        </div>

        {/* 2-Column Split: Active Operations & Renewal Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 spans): Vehicles & Maintenance Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Registered Vehicles Spotlight */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Vehicles</h3>
                  <p className="text-xs text-slate-500">Quick status check across your registered garage</p>
                </div>
                <Link
                  to="/garage"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Manage All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {userVehicles.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Car className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">No vehicles registered in your garage yet.</p>
                  <button
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    Add First Vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userVehicles.map((veh) => (
                    <div
                      key={veh.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/70 transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">
                          {veh.make} {veh.model}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {veh.registrationNumber} · {veh.manufactureYear}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-teal-700 mt-1 block tabular-nums">
                          {veh.currentOdometer.toLocaleString()} km
                        </span>
                      </div>
                      <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 shadow-xs"
                      >
                        Book Bay
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Service History */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Service History</h3>
                  <p className="text-xs text-slate-500">Verified receipts & maintenance timeline</p>
                </div>
                <Link
                  to="/maintenance"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Full History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentServices.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">
                  No service records logged yet. Use "Log Service" to keep a digital maintenance trail.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentServices.map((record) => (
                    <div
                      key={record.id}
                      className="p-3 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block">{record.workshopName}</span>
                        <p className="text-slate-600 line-clamp-1">{record.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{formatNepaliDate(record.serviceDate)}</span>
                          <span>·</span>
                          <span className="tabular-nums">{record.odometerReading.toLocaleString()} km</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 block tabular-nums">
                          {formatNpr(record.totalCostNpr)}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 span): Bluebook & Genuine Spare Parts */}
          <div className="space-y-6">
            
            {/* Urgent Document Reminders */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Renewal Deadlines</h3>
                </div>
                <Link to="/documents" className="text-xs text-teal-600 hover:underline">
                  All ({documents.length})
                </Link>
              </div>

              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No documents uploaded.</p>
              ) : (
                <div className="space-y-2.5">
                  {documents.slice(0, 4).map((doc) => {
                    const status = calculateExpiryStatus(doc.expiryDate);
                    return (
                      <div
                        key={doc.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 block truncate max-w-[170px]">
                            {doc.title}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Due: {formatNepaliDate(doc.expiryDate)}
                          </span>
                        </div>
                        <span className={`text-[11px] font-semibold ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Curated Parts Offers */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">Genuine Parts Offers</h3>
                </div>
                <Link to="/parts" className="text-xs text-teal-400 hover:underline">
                  Explore
                </Link>
              </div>

              <div className="space-y-3">
                {featuredParts.map((part) => (
                  <div
                    key={part.id}
                    className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-white line-clamp-1">{part.name}</span>
                      {part.discountPercentage && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
                          -{part.discountPercentage}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">{part.category}</span>
                      <span className="font-bold text-teal-300 tabular-nums">
                        {formatNpr(part.priceNpr)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer-to-Peer Bike Marketplace Widget */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3 border border-teal-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">Bike Buy & Rent Hub</h3>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  New
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Rent touring bikes for mountain trails or list your motorcycle for direct sale with zero broker fee.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <Link
                  to="/marketplace"
                  className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl text-center transition-colors shadow-2xs"
                >
                  Explore Marketplace
                </Link>
                <Link
                  to="/marketplace"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl text-center transition-colors"
                >
                  List Bike
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={async (data) => {
          await addVehicle(data);
        }}
      />

      <BookingWizardModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicles={userVehicles}
        providers={providers}
        onSubmitBooking={createBooking}
      />

      <EmergencyModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        vehicles={userVehicles}
        onSubmitSos={createEmergencyRequest}
      />
    </div>
  );
};
