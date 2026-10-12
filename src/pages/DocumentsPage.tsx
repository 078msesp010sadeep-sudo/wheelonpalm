import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { VehicleDocument } from '../types';
import { DocumentModal } from '../components/documents/DocumentModal';
import { formatNepaliDate, calculateExpiryStatus } from '../lib/formatters';
import { FileText, Plus, Shield, AlertTriangle, CheckCircle2, Clock, Trash2, Edit3, Info } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { userVehicles, documents, addDocument, updateDocument, deleteDocument } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<VehicleDocument | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'expired'>('all');

  const docsWithStatus = documents.map((doc) => ({
    ...doc,
    statusCalc: calculateExpiryStatus(doc.expiryDate),
    vehicle: userVehicles.find((v) => v.id === doc.vehicleId),
  }));

  const filteredDocs = docsWithStatus.filter((d) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'expired') return d.statusCalc.status === 'expired';
    if (filterStatus === 'critical') return d.statusCalc.status === 'critical';
    if (filterStatus === 'warning') return d.statusCalc.status === 'warning' || d.statusCalc.status === 'critical';
    return true;
  });

  const expiredCount = docsWithStatus.filter((d) => d.statusCalc.status === 'expired').length;
  const criticalCount = docsWithStatus.filter((d) => d.statusCalc.status === 'critical').length;
  const warningCount = docsWithStatus.filter((d) => d.statusCalc.status === 'warning').length;

  const handleEdit = (doc: VehicleDocument) => {
    setDocToEdit(doc);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this document reminder?')) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bluebook & Document Reminders
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Nepal DOTM Savari Darta, Sawari Kar (Road Tax), Comprehensive Insurance, and Emission Green Stickers.
            </p>
          </div>

          <button
            onClick={() => {
              setDocToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add Document Record</span>
          </button>
        </div>

        {/* Backend Reminder Infrastructure Notice */}
        <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Renewal Notification System:</span>
            <p className="leading-relaxed text-teal-800">
              In-app status badges calculate real-time deadlines based on your vehicle's Asia/Kathmandu calendar expiry. Automated external SMS / push notifications require a configured notification service and scheduled Cloud Functions job.
            </p>
          </div>
        </div>

        {/* Quick Expiry Status Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] opacity-80 block">Total Tracked</span>
            <span className="text-xl font-bold tabular-nums">{documents.length}</span>
          </button>

          <button
            onClick={() => setFilterStatus('expired')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              filterStatus === 'expired'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] opacity-80 block">Overdue Renewals</span>
            <span className={`text-xl font-bold tabular-nums ${filterStatus !== 'expired' && expiredCount > 0 ? 'text-red-600' : ''}`}>
              {expiredCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('critical')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              filterStatus === 'critical'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] opacity-80 block">Expiring (&lt; 7 Days)</span>
            <span className={`text-xl font-bold tabular-nums ${filterStatus !== 'critical' && criticalCount > 0 ? 'text-amber-600' : ''}`}>
              {criticalCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('warning')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              filterStatus === 'warning'
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] opacity-80 block">Upcoming (&lt; 30 Days)</span>
            <span className="text-xl font-bold tabular-nums">{warningCount}</span>
          </button>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No documents in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your Bluebook or Insurance policy to receive automated warnings before DOTM late penalty fines occur.
            </p>
            <button
              onClick={() => {
                setDocToEdit(null);
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Add Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {doc.documentType.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </h3>
                      {doc.vehicle && (
                        <span className="text-xs text-slate-600 font-medium">
                          {doc.vehicle.make} {doc.vehicle.model} ({doc.vehicle.registrationNumber})
                        </span>
                      )}
                    </div>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      doc.statusCalc.status === 'expired'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : doc.statusCalc.status === 'critical'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : doc.statusCalc.status === 'warning'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {doc.statusCalc.label}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reference / Token:</span>
                      <span className="font-mono font-semibold text-slate-900">{doc.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issue Date:</span>
                      <span>{formatNepaliDate(doc.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Renewal Expiry:</span>
                      <span className="font-semibold text-slate-900">{formatNepaliDate(doc.expiryDate)}</span>
                    </div>
                    {doc.notes && (
                      <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                        {doc.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Alert schedule: {doc.remindDaysBefore?.join(', ')} days before
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDocToEdit(null);
        }}
        vehicles={userVehicles}
        docToEdit={docToEdit}
        onSave={async (doc) => {
          if (docToEdit) {
            await updateDocument(docToEdit.id, doc);
          } else {
            await addDocument(doc);
          }
        }}
      />
    </div>
  );
};
