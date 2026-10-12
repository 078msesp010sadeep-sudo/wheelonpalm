import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ServiceBooking, BookingStatus } from '../types';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { formatNpr, formatNepaliDate } from '../lib/formatters';
import { Calendar, Plus, Clock, MapPin, Phone, CheckCircle2, XCircle, AlertCircle, Wrench, Truck } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { userVehicles, userBookings, providers, createBooking, cancelBooking } = useData();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = userBookings.filter((b) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['pending', 'accepted', 'scheduled', 'in_progress'].includes(b.status);
    if (statusFilter === 'completed') return b.status === 'completed';
    if (statusFilter === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold">Pending Workshop Review</span>;
      case 'accepted':
      case 'scheduled':
        return <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-semibold">Scheduled Bay Confirmed</span>;
      case 'in_progress':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-semibold">On Lift / In Progress</span>;
      case 'completed':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold">Completed & Inspected</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize">{status}</span>;
      default:
        return null;
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment reservation?')) {
      await cancelBooking(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Service Appointments & Bookings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track workshop reservation status, pickup/drop valet progress, and service estimates.
            </p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Status Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'active', label: 'Active Appointments' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled / Past' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No appointments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Need periodic engine tuning, brake overhaul, or EV diagnostic check? Reserve your slot in 2 minutes.
            </p>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Book Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {booking.bookingRef}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-600 capitalize">
                          {booking.serviceCategory.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {booking.providerName}
                      </h3>
                    </div>
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">Vehicle</span>
                    <span className="font-semibold text-slate-900 block">{booking.vehicleSummary}</span>
                    <span className="text-[11px] text-slate-500 capitalize">Mode: {booking.bookingType.replace('_', ' ')}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">Scheduled Window</span>
                    <span className="font-semibold text-slate-900 block">{formatNepaliDate(booking.preferredDate)}</span>
                    <span className="text-[11px] text-slate-500">{booking.preferredTimeSlot}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">Estimated Cost</span>
                    <span className="font-bold text-teal-700 block text-sm tabular-nums">
                      {formatNpr(booking.estimatedCostNpr || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 italic block">* Initial estimate</span>
                  </div>
                </div>

                {/* Problem Description & Address */}
                <div className="text-xs space-y-2">
                  <div className="text-slate-600">
                    <strong className="text-slate-800">Customer Notes:</strong> {booking.problemDescription}
                  </div>

                  {booking.pickupAddress && (
                    <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Doorstep Pickup: {booking.pickupAddress}</span>
                    </div>
                  )}

                  {booking.providerNotes && (
                    <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl text-teal-900 text-xs">
                      <strong>Workshop Advisor Note:</strong> {booking.providerNotes}
                    </div>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Booked on: {formatNepaliDate(booking.createdAt)}
                  </span>

                  {(booking.status === 'pending' || booking.status === 'accepted') && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BookingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        vehicles={userVehicles}
        providers={providers}
        onSubmitBooking={createBooking}
      />
    </div>
  );
};
