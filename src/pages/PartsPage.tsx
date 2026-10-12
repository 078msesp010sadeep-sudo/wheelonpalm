import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SparePart } from '../types';
import { PartEnquiryModal } from '../components/parts/PartEnquiryModal';
import { CartDrawer } from '../components/parts/CartDrawer';
import { CheckoutModal } from '../components/parts/CheckoutModal';
import { OrderSuccessModal } from '../components/parts/OrderSuccessModal';
import { formatNpr } from '../lib/formatters';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Bookmark, 
  CheckCircle2, 
  Phone, 
  Tag, 
  ShieldCheck, 
  Truck,
  Plus,
  Package,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

export const PartsPage: React.FC = () => {
  const { 
    spareParts, 
    savedPartIds, 
    toggleSavePart, 
    submitPartEnquiry, 
    cart, 
    addToCart, 
    userPartsOrders 
  } = useData();

  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'saved'>('shop');
  const [selectedPartForEnquiry, setSelectedPartForEnquiry] = useState<SparePart | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Checkout state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrderRef, setSuccessOrderRef] = useState<string | null>(null);

  const categories = [
    'all',
    'Engine Oil & Fluids',
    'Brakes',
    'Batteries',
    'Filters',
    'Electrical',
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredParts = spareParts.filter((part) => {
    const matchesCat = categoryFilter === 'all' || part.category === categoryFilter;
    const matchesSaved = activeTab !== 'saved' || savedPartIds.includes(part.id);
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.compatibleVehicles.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
      part.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSaved && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header with Cart Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Automotive Spare Parts Shop
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200">
                Genuine OEM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct pricing in NPR from verified Nepal distributors in Teku, Birgunj & Kathmandu with express dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'saved'
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved ({savedPartIds.length})</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 50-Year Entrepreneur Wisdom Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                उस्तादजी (Ustad-Ji) 50-Year Spare Parts Advisory:
              </h4>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Always demand holographic OEM seal verification on brake pads and spark plugs. Cheap counterfeit brake pads overheat and glaze on steep Prithvi Highway descents.
              </p>
            </div>
          </div>

          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Genuine Guaranteed
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Parts Shop ({spareParts.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Parts Orders ({userPartsOrders.length})</span>
          </button>
        </div>

        {/* SHOP TAB */}
        {activeTab === 'shop' || activeTab === 'saved' ? (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search part name, OEM number, vehicle (Creta, Pulsar, Swift)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Parts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => {
                const isSaved = savedPartIds.includes(part.id);
                const cartItem = cart.find((c) => c.part.id === part.id);

                return (
                  <div
                    key={part.id}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={part.imageUrl || '/src/assets/images/auto_parts_catalog_1791636541696.jpg'}
                          alt={part.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {part.discountPercentage && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                            {part.discountPercentage}% OFF
                          </span>
                        )}

                        <button
                          onClick={() => toggleSavePart(part.id)}
                          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                            isSaved ? 'bg-teal-600 text-white' : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
                          }`}
                          aria-label="Save part"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Body Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>{part.category}</span>
                            <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {part.partNumber}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {part.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {part.description}
                        </p>

                        {/* Compatibility */}
                        <div className="pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-400 block mb-1">Compatible with:</span>
                          <div className="flex flex-wrap gap-1">
                            {part.compatibleVehicles.map((v, idx) => (
                              <span key={idx} className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60 text-[10px]">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Supplier info */}
                        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                          <span>Supplier: <strong className="text-slate-700">{part.supplierName}</strong></span>
                          <span className="text-emerald-700 font-medium">In Stock ({part.stockCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action footer with Direct Add to Cart */}
                    <div className="p-5 pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-base font-bold text-slate-900 tabular-nums">
                            {formatNpr(part.priceNpr)}
                          </span>
                          {part.originalPriceNpr && (
                            <span className="text-xs text-slate-400 line-through tabular-nums ml-1.5">
                              {formatNpr(part.originalPriceNpr)}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-teal-600" /> Nepal Delivery
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(part, 1);
                            setIsCartOpen(true);
                          }}
                          className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}</span>
                        </button>

                        <button
                          onClick={() => setSelectedPartForEnquiry(part)}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                          title="Custom Enquiry"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* MY ORDERS TAB */
          <div className="space-y-4">
            {userPartsOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No parts orders yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you order genuine OEM parts through our shop, you can track dispatch progress and delivery status right here.
                </p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Browse Parts Shop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userPartsOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900">
                            {order.orderRef}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                          {formatNpr(order.totalAmountNpr)}
                        </span>
                        <span className="text-[10px] text-slate-500 block uppercase">
                          Payment: {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500 block">Ordered Items:</span>
                      <div className="divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="py-1.5 flex justify-between text-xs text-slate-800">
                            <span>{it.name} <span className="text-slate-400">× {it.quantity}</span></span>
                            <span className="font-semibold tabular-nums">{formatNpr(it.priceNpr * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Delivery to: <strong>{order.deliveryAddress}, {order.city}</strong></span>
                      <span className="font-mono text-slate-500">{order.customerPhone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(ref) => {
          setSuccessOrderRef(ref);
          setActiveTab('orders');
        }}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={Boolean(successOrderRef)}
        onClose={() => setSuccessOrderRef(null)}
        orderRef={successOrderRef}
      />

      {/* Custom Part Enquiry Modal */}
      <PartEnquiryModal
        isOpen={Boolean(selectedPartForEnquiry)}
        onClose={() => setSelectedPartForEnquiry(null)}
        part={selectedPartForEnquiry}
        onSubmitEnquiry={submitPartEnquiry}
      />
    </div>
  );
};
