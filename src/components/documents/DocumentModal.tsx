import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { VehicleDocument, DocumentType, Vehicle } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<VehicleDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  vehicles: Vehicle[];
  defaultVehicleId?: string;
  docToEdit?: VehicleDocument | null;
}

const DOCUMENT_TYPES: { type: DocumentType; label: string; desc: string }[] = [
  { type: 'bluebook', label: 'Bluebook (Savari Darta Pramanpatra)', desc: 'Official DOTM vehicle registration booklet' },
  { type: 'vehicle_tax', label: 'Annual Vehicle Road Tax (Sawari Kar)', desc: 'Yearly provincial transport revenue tax token' },
  { type: 'insurance', label: 'Motor Vehicle Insurance Policy', desc: 'Comprehensive or Third-Party mandatory cover' },
  { type: 'pollution_test', label: 'Vehicle Emission Test (Green Sticker)', desc: 'DOTM smoke emission compliance certificate' },
  { type: 'driving_licence', label: 'Driving Licence (Savari Chalak Anumatipatra)', desc: 'Voluntarily stored driver credential' },
  { type: 'other', label: 'Other Automotive Document / Fitness Test', desc: 'Route permit, NOC, purchase invoice, etc.' },
];

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles,
  defaultVehicleId,
  docToEdit,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ''));
  const [documentType, setDocumentType] = useState<DocumentType>('bluebook');
  const [title, setTitle] = useState('Bluebook Registration Certificate');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [remind30, setRemind30] = useState(true);
  const [remind7, setRemind7] = useState(true);
  const [remind1, setRemind1] = useState(true);

  useEffect(() => {
    if (docToEdit) {
      setVehicleId(docToEdit.vehicleId);
      setDocumentType(docToEdit.documentType);
      setTitle(docToEdit.title);
      setReferenceNumber(docToEdit.referenceNumber);
      setIssueDate(docToEdit.issueDate);
      setExpiryDate(docToEdit.expiryDate);
      setNotes(docToEdit.notes || '');
      setRemind30(docToEdit.remindDaysBefore?.includes(30) ?? true);
      setRemind7(docToEdit.remindDaysBefore?.includes(7) ?? true);
      setRemind1(docToEdit.remindDaysBefore?.includes(1) ?? true);
    } else {
      setVehicleId(defaultVehicleId || (vehicles[0]?.id || ''));
      setDocumentType('bluebook');
      setTitle('Bluebook Registration Certificate');
      setReferenceNumber('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      // Expiry 1 year ahead by default
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiryDate(nextYear.toISOString().split('T')[0]);
      setNotes('');
      setRemind30(true);
      setRemind7(true);
      setRemind1(true);
    }
    setError(null);
  }, [docToEdit, defaultVehicleId, vehicles, isOpen]);

  const handleDocTypeChange = (type: DocumentType) => {
    setDocumentType(type);
    const selected = DOCUMENT_TYPES.find((d) => d.type === type);
    if (selected) {
      setTitle(selected.label.split(' (')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      setError('Please select a vehicle.');
      return;
    }
    if (!title.trim() || !referenceNumber.trim() || !expiryDate) {
      setError('Please fill title, reference number, and expiry date.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const remindDays: number[] = [];
      if (remind30) remindDays.push(30);
      if (remind7) remindDays.push(7);
      if (remind1) remindDays.push(1);

      await onSave({
        userId: user?.uid || 'demo-user-123',
        vehicleId,
        documentType,
        title: title.trim(),
        referenceNumber: referenceNumber.trim(),
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        expiryDate,
        notes: notes.trim() || undefined,
        remindDaysBefore: remindDays,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save document details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={docToEdit ? 'Edit Document Reminder' : 'Add Vehicle Document & Reminder'}
      subtitle="Track renewal deadlines for Nepal Bluebook, Tax, Insurance, and Emission Green Stickers."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Vehicle Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Associated Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Category *
            </label>
            <select
              value={documentType}
              onChange={(e) => handleDocTypeChange(e.target.value as DocumentType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt.type} value={dt.type}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Document Title & Reference Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Annual Bluebook Renewal"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Receipt / Policy / Certificate # *
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
              placeholder="e.g. DOTM-079-8812 or SIC-991823"
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Renewal Expiry Date *
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Renewal Alerts Preference */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">
            Automated Expiry Warnings:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remind30}
                onChange={(e) => setRemind30(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>30 days before</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remind7}
                onChange={(e) => setRemind7(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>7 days before</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remind1}
                onChange={(e) => setRemind1(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>1 day before</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Transport Office / Additional Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Yatayat Karyalaya Ekantakuna, Lalitpur. Paid via Nagarik App."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : docToEdit ? 'Update Document' : 'Save Document & Alerts'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
