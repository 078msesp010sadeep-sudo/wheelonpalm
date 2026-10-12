import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { VehicleMarketplaceListing } from '../../types';
import { formatNpr } from '../../lib/formatters';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: VehicleMarketplaceListing | null;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  listing,
}) => {
  const { user } = useAuth();

  const [offeredPriceNpr, setOfferedPriceNpr] = useState<number>(
    listing?.salePriceNpr ? Math.round(listing.salePriceNpr * 0.95) : 200000
  );
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [message, setMessage] = useState(
    'Namaste, I am interested in purchasing this vehicle. Can we schedule a physical inspection and bluebook verification?'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste ${listing.ownerName}, I saw your listing for "${listing.title}" on WheelOnPalm. I would like to offer NPR ${offeredPriceNpr.toLocaleString()} and arrange an inspection.`
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSuccess ? handleReset : onClose}
      title={isSuccess ? 'Offer Sent to Owner!' : `Make Offer / Buy: ${listing.title}`}
      subtitle={
        isSuccess
          ? 'The seller has received your contact details.'
          : 'Direct negotiation with zero dealer middlemen commission.'
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="space-y-5 text-center py-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Offer Transmitted Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your offer of <strong>{formatNpr(offeredPriceNpr)}</strong> for <strong>{listing.title}</strong> has been forwarded to <strong>{listing.ownerName}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Listed Price:</span>
              <span className="line-through">{formatNpr(listing.salePriceNpr || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold">
              <span>Your Offered Price:</span>
              <span className="text-emerald-700">{formatNpr(offeredPriceNpr)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Seller Contact:</span>
              <span className="font-mono">{listing.ownerPhone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`https://wa.me/${listing.ownerPhone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </a>

            <button
              onClick={handleReset}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle mini details */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={listing.images[0] || '/src/assets/images/bike_sale_nepal_1791704928683.jpg'}
              alt={listing.title}
              className="w-14 h-14 object-cover rounded-xl shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {listing.location}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {listing.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  Asking: {formatNpr(listing.salePriceNpr || 0)}
                </span>
                {listing.isPriceNegotiable && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                    Negotiable
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Your Offer Amount (NPR) *
            </label>
            <input
              type="number"
              min="1000"
              required
              value={offeredPriceNpr}
              onChange={(e) => setOfferedPriceNpr(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Message to Seller
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>WheelOnPalm Trust Advisory:</strong> Always verify physical bluebook tax stamps, engine/chassis number stamping matching at Yatayat Karyalaya before exchanging funds.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Send Offer to Seller</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
