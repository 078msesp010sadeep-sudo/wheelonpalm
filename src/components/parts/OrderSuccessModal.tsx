import React from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Phone } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderRef: string | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderRef,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Confirmed!"
      subtitle="Your spare parts order is being processed for dispatch."
      maxWidth="sm"
    >
      <div className="text-center py-4 space-y-5">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <PackageCheck className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Order Reference
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">
            {orderRef || 'WOP-ORD-8821'}
          </h3>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            A confirmation notification has been registered in the system. The distributor will dispatch via local courier or express bus service.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Truck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Estimated Delivery: Within 24–48 Hours</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Delivery rider will call before arriving at your location.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          View My Orders & Continue
        </button>
      </div>
    </Modal>
  );
};
