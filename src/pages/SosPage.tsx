import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { EmergencyRequest, EmergencyStatus } from '../types';
import { EmergencyModal } from '../components/sos/EmergencyModal';
import { formatNepaliDateTime, NEPAL_EMERGENCY_CONTACTS } from '../lib/formatters';
import { 
  AlertTriangle, 
  Truck, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Navigation,
  Compass
} from 'lucide-react';

export const SosPage: React.FC = () => {
  const { userVehicles, userEmergencyRequests, createEmergencyRequest, updateEmergencyStatus } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case 'requested':
        return <span className="text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">Broadcasting Alert...</span>;
      case 'accepted':
      case 'provider_assigned':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold">Responder Assigned</span>;
      case 'on_the_way':
        return <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-bold">Unit On The Way</span>;
      case 'resolved':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold">Assistance Resolved</span>;
      case 'cancelled':
        return <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Urgent Emergency Dispatch Hero Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src="/src/assets/images/roadside_rescue_service_1791636531510.jpg"
              alt="Nepal Roadside Rescue Unit"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>24/7 Roadside Assistance Corridor</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Stranded on the Road? <br />
              <span className="text-red-400">Request Instant Rescue.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dispatch authorized flatbed towing, heavy jump-start packs, or tire vulcanizing units across Kathmandu Valley and highway corridors.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Broadcast Emergency SOS Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Immediate Nepal Helpline Strip */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Direct Nepal Emergency Authorities (Toll-Free)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {NEPAL_EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="p-3 bg-red-50/60 hover:bg-red-100/70 border border-red-200/70 rounded-xl transition-colors block text-left group"
              >
                <span className="font-bold text-red-900 block group-hover:underline">{c.name}</span>
                <span className="text-lg font-black text-red-600 tabular-nums font-mono mt-0.5 block">
                  Dial {c.number}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">{c.desc}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Active & Past SOS History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your Emergency Dispatches ({userEmergencyRequests.length})
          </h2>

          {userEmergencyRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No active breakdown alerts</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You currently have no emergency dispatches. If you experience vehicle trouble, tap the SOS button above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userEmergencyRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {req.sosRef}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs font-semibold text-red-700 capitalize">
                            {req.emergencyType.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {req.vehicleSummary}
                        </span>
                      </div>
                    </div>

                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] block">Location</span>
                      <span className="font-semibold text-slate-900 block">{req.locationAddress}</span>
                      {req.latitude && req.longitude && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Lat: {req.latitude.toFixed(4)}, Lon: {req.longitude.toFixed(4)}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] block">Assigned Responder</span>
                      <span className="font-semibold text-slate-900 block">
                        {req.assignedProviderName || 'Awaiting nearest patrol accept'}
                      </span>
                      {req.assignedProviderPhone && (
                        <span className="font-mono text-teal-700 block">
                          {req.assignedProviderPhone}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] block">Contact Driver Phone</span>
                      <span className="font-semibold font-mono text-slate-900 block">{req.contactPhone}</span>
                      <span className="text-[11px] text-slate-400 block">
                        Requested: {formatNepaliDateTime(req.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                    <strong>Reported Situation:</strong> {req.description}
                  </div>

                  {/* Actions for testing / cancelling */}
                  {req.status !== 'resolved' && req.status !== 'cancelled' && (
                    <div className="flex items-center justify-end gap-3 pt-2 text-xs">
                      <button
                        onClick={() => updateEmergencyStatus(req.id, 'cancelled')}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800"
                      >
                        Cancel Request
                      </button>
                      <button
                        onClick={() => updateEmergencyStatus(req.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-xs"
                      >
                        Mark as Safely Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <EmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={userVehicles}
        onSubmitSos={createEmergencyRequest}
      />
    </div>
  );
};
