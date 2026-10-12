import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatNpr, formatNepaliDate, formatNepaliDateTime } from '../lib/formatters';
import { 
  Shield, 
  Users, 
  Car, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Activity,
  Search,
  Building2
} from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    vehicles, 
    bookings, 
    emergencyRequests, 
    providers, 
    auditLogs, 
    approveProviderApplication, 
    rejectProviderApplication 
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'bookings' | 'sos' | 'audit'>('overview');
  const [rejectReason, setRejectReason] = useState('');
  const [targetApplicantUid, setTargetApplicantUid] = useState<string | null>(null);

  // Mock pending provider applications for review
  const pendingApplications = [
    {
      uid: 'applicant-01',
      businessName: 'Lalitpur Smart Auto Bay',
      category: 'workshop',
      city: 'Lalitpur',
      phone: '+977 9851009988',
      appliedAt: '2026-10-09T09:30:00Z',
      documentsProvided: ['VAT Certificate (30198271)', 'Workshop Commercial Licence'],
    },
    {
      uid: 'applicant-02',
      businessName: 'Kathmandu Valley Flatbed Rescue 24/7',
      category: 'roadside',
      city: 'Kathmandu',
      phone: '+977 9801229900',
      appliedAt: '2026-10-08T14:15:00Z',
      documentsProvided: ['Recovery Fleet Registration', 'Commercial Heavy Vehicle Licence'],
    }
  ];

  const handleApprove = async (app: typeof pendingApplications[0]) => {
    await approveProviderApplication(app.uid, app.businessName);
    alert(`Approved ${app.businessName}! Provider account activated.`);
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetApplicantUid) return;
    await rejectProviderApplication(targetApplicantUid, rejectReason);
    setTargetApplicantUid(null);
    setRejectReason('');
    alert('Provider application rejected and audit entry logged.');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400">· Nepal Platform Governance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              WheelOnPalm Administration
            </h1>
            <p className="text-xs text-slate-300">
              Provider accreditation, system audit logs, emergency SOS monitoring & operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              Zero-Trust RBAC Enforced
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs">
          {[
            { id: 'overview', label: 'Platform Metrics' },
            { id: 'providers', label: `Provider Approvals (${pendingApplications.length})` },
            { id: 'bookings', label: `Bookings Oversight (${bookings.length})` },
            { id: 'sos', label: `Roadside SOS Monitor (${emergencyRequests.length})` },
            { id: 'audit', label: `Security Audit Trail (${auditLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Platform Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Total Vehicles Managed</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{vehicles.length}</p>
                <span className="text-[11px] text-teal-700 mt-1 block">Two-wheelers & Four-wheelers</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Verified Workshops</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{providers.length}</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Kathmandu, Lalitpur, Pokhara</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Total Appointments Logged</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{bookings.length}</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Scheduled & Completed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Emergency SOS Dispatches</span>
                <p className="text-2xl font-bold text-red-600 tabular-nums mt-1">{emergencyRequests.length}</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Towing & breakdown calls</span>
              </div>
            </div>

            {/* Platform operational health */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Platform Compliance & Data Integrity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                WheelOnPalm enforces role verification through secure backend checks. Client users cannot elevate privileges to administrator or provider roles without explicit verification records created in the audit log.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Provider Approvals */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Pending Workshop & Towing Provider Verification
            </h3>

            {pendingApplications.map((app) => (
              <div
                key={app.uid}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{app.businessName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold uppercase">
                        {app.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Location: {app.city} · Hotline: <span className="font-mono">{app.phone}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTargetApplicantUid(app.uid)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
                    >
                      Approve & Grant Provider Role
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-semibold block text-slate-700">Verification Documentation:</span>
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    {app.documentsProvided.map((doc, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-slate-700">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Bookings Oversight */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Platform Service Bookings</h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900">{b.bookingRef}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="font-semibold text-slate-800">{b.providerName}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Customer: {b.customerName} ({b.customerPhone}) · {b.vehicleSummary}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 tabular-nums">{formatNpr(b.estimatedCostNpr || 0)}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: SOS Monitor */}
        {activeTab === 'sos' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Roadside Assistance Dispatches</h3>
            <div className="space-y-3">
              {emergencyRequests.map((sos) => (
                <div
                  key={sos.id}
                  className="p-3 bg-red-50/40 border border-red-200/60 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-bold text-red-900">{sos.sosRef}</span>
                    <span className="text-red-700 font-semibold capitalize ml-2">
                      {sos.emergencyType.replace('_', ' ')}
                    </span>
                    <span className="text-slate-600 block text-[11px] mt-0.5">
                      Driver: {sos.userName} ({sos.contactPhone}) · Loc: {sos.locationAddress}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-700 capitalize">{sos.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Audit Log */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Security & Operational Audit Log</h3>
            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-400">{formatNepaliDateTime(log.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs">{log.details}</p>
                  <span className="text-[10px] text-slate-400 block">Actor: {log.actorEmail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {targetApplicantUid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Specify Rejection Reason</h3>
              <form onSubmit={handleReject} className="space-y-3">
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete VAT certificate, unable to reach contact telephone number."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetApplicantUid(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg"
                  >
                    Confirm Rejection
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
