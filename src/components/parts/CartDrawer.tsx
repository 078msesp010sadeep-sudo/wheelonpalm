import React from 'react';
import { useData } from '../../context/DataContext';
import { formatNpr } from '../../lib/formatters';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useData();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.part.priceNpr * item.quantity, 0);
  const deliveryFee = subtotal > 5000 || cart.length === 0 ? 0 : 250;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Spare Parts Cart</h3>
                <span className="text-[11px] text-slate-500">
                  {cart.length} unique item{cart.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our genuine OEM spare parts catalogue and add components to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.part.id}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3"
                  >
                    <img
                      src={item.part.imageUrl || '/src/assets/images/auto_parts_catalog_1791636541696.jpg'}
                      alt={item.part.name}
                      className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.part.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {item.part.partNumber}
                      </span>
                      <div className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                        {formatNpr(item.part.priceNpr * item.quantity)}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.part.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.part.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.part.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline pt-2 block mx-auto"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <strong className="text-slate-900 tabular-nums">{formatNpr(subtotal)}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-teal-600" />
                    Delivery Across Nepal:
                  </span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-700">FREE (Orders &gt; NPR 5k)</strong>
                    ) : (
                      formatNpr(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-teal-700 tabular-nums">{formatNpr(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Genuine OEM Warranty & Free Return Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
