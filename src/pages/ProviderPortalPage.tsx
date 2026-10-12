import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ServiceBooking, BookingStatus } from '../types';
import { formatNpr, formatNepaliDate } from '../lib/formatters';
import { 
  Wrench, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Phone,
  Shield,
  Truck
} from 'lucide-react';

export const ProviderPortalPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, providers } = useData();

  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [selectedBookingForNote, setSelectedBookingForNote] = useState<ServiceBooking | null>(null);
  const [technicianNote, setTechnicianNote] = useState('');

  // Assigned bookings (in demo, shows all or workshop-relevant)
  const myBookings = bookings;

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateBookingStatus(id, newStatus);
  };

  const handleSaveTechnicianNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForNote) return;
    await updateBookingStatus(selectedBookingForNote.id, selectedBookingForNote.status, technicianNote.trim());
    setSelectedBookingForNote(null);
    setTechnicianNote('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Workshop Operations
              </span>
              <span className="text-xs text-slate-400">· Nepal Auto Network</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Service Provider Portal
            </h1>
            <p className="text-xs text-slate-300">
              Manage incoming customer bay reservations, confirm schedules, and log completed work.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Logged in as:</span>
            <span className="text-xs font-semibold text-teal-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {user?.providerBusinessName || 'Apex Motor Works (Authorized)'}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === 'appointments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Customer Bookings Queue ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Workshop Operating Hours & Facilities
          </button>
        </div>

        {/* Appointments Queue Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No appointments in the queue</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Customer bookings will appear here in real-time as they are scheduled.
                </p>
              </div>
            ) : (
              myBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{bk.bookingRef}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-teal-700 capitalize">
                          {bk.serviceCategory.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        Customer: {bk.customerName} (<a href={`tel:${bk.customerPhone}`} className="text-teal-700 underline font-mono">{bk.customerPhone}</a>)
                      </h3>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={bk.status}
                        onChange={(e) => handleStatusChange(bk.id, e.target.value as BookingStatus)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress (On Lift)</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 text-[10px] block">Vehicle</span>
                      <span className="font-semibold text-slate-900">{bk.vehicleSummary}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 text-[10px] block">Requested Time Slot</span>
                      <span className="font-semibold text-slate-900">
                        {formatNepaliDate(bk.preferredDate)} · {bk.preferredTimeSlot}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 text-[10px] block">Delivery Mode</span>
                      <span className="font-semibold text-slate-900 capitalize">
                        {bk.bookingType.replace('_', ' ')}
                      </span>
                      {bk.pickupAddress && (
                        <span className="text-[11px] text-slate-500 block truncate">
                          Address: {bk.pickupAddress}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer issue note */}
                  <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                    <strong>Reported Fault / Request:</strong> {bk.problemDescription}
                  </div>

                  {/* Existing or Add note */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      {bk.providerNotes ? (
                        <span className="text-slate-600 text-[11px]">
                          <strong>Advisor Log:</strong> {bk.providerNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          No technician inspection notes added yet.
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBookingForNote(bk);
                        setTechnicianNote(bk.providerNotes || '');
                      }}
                      className="text-xs text-teal-600 hover:text-teal-700 font-semibold underline"
                    >
                      {bk.providerNotes ? 'Update Log' : '+ Add Technician Log'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Operating Hours Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">Workshop Facilities & Hours</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold">Operating Schedule:</span>
                <span>Sunday - Friday (08:30 AM - 07:00 PM)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold">Hydraulic Lifts:</span>
                <span>4 Vehicle Bays + 1 EV Diagnostic Chamber</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold">Doorstep Valet Pickup & Drop:</span>
                <span className="text-emerald-700 font-semibold">Active in Kathmandu Ring Road</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Standard Diagnostic Base Fee:</span>
                <span className="font-mono font-bold text-slate-900">NPR 500</span>
              </div>
            </div>
          </div>
        )}

        {/* Technician Note Modal */}
        {selectedBookingForNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Add Workshop Note ({selectedBookingForNote.bookingRef})
              </h3>
              <form onSubmit={handleSaveTechnicianNote} className="space-y-3">
                <textarea
                  rows={3}
                  value={technicianNote}
                  onChange={(e) => setTechnicianNote(e.target.value)}
                  placeholder="e.g. Inspected front disc thickness (found 18mm, safe limit). Cleaned brake dust and refilled brake fluid."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForNote(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
