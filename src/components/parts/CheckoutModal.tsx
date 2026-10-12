import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatNpr } from '../../lib/formatters';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderRef: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { user } = useAuth();
  const { cart, createPartsOrder } = useData();

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [deliveryAddress, setDeliveryAddress] = useState('New Baneshwor, Ward No. 10');
  const [city, setCity] = useState('Kathmandu');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'esewa' | 'khalti'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CITIES = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Butwal', 'Biratnagar', 'Dharan'];

  const subtotal = cart.reduce((sum, item) => sum + item.part.priceNpr * item.quantity, 0);
  const deliveryFee = subtotal > 5000 || cart.length === 0 ? 0 : 250;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setError('Please provide name, phone, and complete delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRef = await createPartsOrder({
        userId: user?.uid || 'demo-user-123',
        customerName,
        customerPhone,
        deliveryAddress,
        city,
        paymentMethod,
        items: cart.map((c) => ({
          partId: c.part.id,
          name: c.part.name,
          priceNpr: c.part.priceNpr,
          quantity: c.quantity,
        })),
        subtotalNpr: subtotal,
        deliveryFeeNpr: deliveryFee,
        totalAmountNpr: grandTotal,
      });

      onClose();
      onOrderSuccess(orderRef);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Checkout & Delivery Details"
      subtitle="Complete your spare parts order with dispatch across Nepal."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Recipient Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-teal-600" />
            1. Recipient Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-600" />
            2. Delivery Location
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                City / Region *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Detailed Street Address *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House / Workshop, Tole, Landmark"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Method */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-teal-600" />
            3. Payment Method in Nepal
          </h4>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-xl border text-left transition-all ${
                paymentMethod === 'cod'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold mb-0.5">Cash on Delivery</div>
              <span className="text-[10px] text-slate-500 block">Pay cash or Fonepay upon parcel receipt</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('esewa')}
              className={`p-3 rounded-xl border text-left transition-all ${
                paymentMethod === 'esewa'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-emerald-700 mb-0.5">eSewa Wallet</div>
              <span className="text-[10px] text-slate-500 block">Direct scan to pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('khalti')}
              className={`p-3 rounded-xl border text-left transition-all ${
                paymentMethod === 'khalti'
                  ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-purple-700 mb-0.5">Khalti Digital</div>
              <span className="text-[10px] text-slate-500 block">Instant digital checkout</span>
            </button>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Items ({cart.length}):</span>
            <span className="tabular-nums font-semibold">{formatNpr(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping / Dispatch Fee:</span>
            <span className="tabular-nums">
              {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatNpr(deliveryFee)}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
            <span>Grand Total:</span>
            <span className="text-teal-700 tabular-nums">{formatNpr(grandTotal)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm Order ({formatNpr(grandTotal)})</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
