import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { SparePart, PartEnquiry } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatNpr } from '../../lib/formatters';
import { Phone, CheckCircle2 } from 'lucide-react';

interface PartEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  part: SparePart | null;
  onSubmitEnquiry: (enquiry: Omit<PartEnquiry, 'id' | 'status' | 'createdAt'>) => Promise<string>;
}

export const PartEnquiryModal: React.FC<PartEnquiryModalProps> = ({
  isOpen,
  onClose,
  part,
  onSubmitEnquiry,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [vehicleModel, setVehicleModel] = useState('');
  const [message, setMessage] = useState('');

  if (!part) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !vehicleModel.trim()) {
      setError('Please provide your contact number and exact vehicle model.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmitEnquiry({
        partId: part.id,
        partName: part.name,
        userId: user?.uid || 'demo-user-123',
        userName: user?.fullName || 'Customer',
        userPhone: phone.trim(),
        userEmail: user?.email || '',
        vehicleModel: vehicleModel.trim(),
        message: message.trim() || `Inquiring availability and delivery for ${part.name}`,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Enquire / Order: ${part.name}`}
      subtitle={`Verified Supplier: ${part.supplierName}`}
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Enquiry Forwarded to Supplier</h4>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {part.supplierName} will contact you at <span className="font-semibold text-slate-900">{phone}</span> to confirm OEM fitment and coordinate pickup or local courier delivery in Nepal.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 max-w-sm mx-auto border border-slate-100">
            <span>Direct Supplier Hotline:</span>{' '}
            <a href={`tel:${part.supplierPhone}`} className="font-bold text-teal-700 underline">
              {part.supplierPhone}
            </a>
          </div>
          <button
            onClick={handleClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 block">Listed Price</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatNpr(part.priceNpr)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Stock Status</span>
              <span className="font-semibold text-emerald-700">
                {part.inStock ? `${part.stockCount} units available` : 'Special Order'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Contact Number in Nepal *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Vehicle Make, Model & Year *
            </label>
            <input
              type="text"
              placeholder="e.g. 2022 Hyundai Creta 1.5 Petrol or Bajaj Pulsar 220"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Helps supplier verify OEM bracket/fitting compatibility before dispatch.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message or Specific Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Do you have delivery to Pokhara or can I pick up today at your Teku warehouse?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Enquiry to Supplier'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
