import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { VehicleMarketplaceListing, MarketplaceListingType } from '../types';
import { VehicleListingModal } from '../components/marketplace/VehicleListingModal';
import { RentalBookingModal } from '../components/marketplace/RentalBookingModal';
import { OfferModal } from '../components/marketplace/OfferModal';
import { formatNpr } from '../lib/formatters';
import { 
  Bike, 
  Car, 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Gauge, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Tag, 
  Check, 
  Filter, 
  Edit3, 
  Trash2, 
  Sparkles,
  Award,
  Clock
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const { 
    marketplaceListings, 
    userMarketplaceListings, 
    deleteMarketplaceListing, 
    markListingStatus 
  } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'sale' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  // Modals state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState<VehicleMarketplaceListing | null>(null);
  const [selectedForRental, setSelectedForRental] = useState<VehicleMarketplaceListing | null>(null);
  const [selectedForOffer, setSelectedForOffer] = useState<VehicleMarketplaceListing | null>(null);

  const LOCATIONS = ['all', 'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan'];

  const filteredListings = marketplaceListings.filter((item) => {
    // Tab filter
    if (activeTab === 'rent' && item.listingType !== 'rental' && item.listingType !== 'both') return false;
    if (activeTab === 'sale' && item.listingType !== 'sale' && item.listingType !== 'both') return false;
    if (activeTab === 'my') {
      const isOwner = item.ownerId === user?.uid || item.ownerId === 'demo-user-123';
      if (!isOwner) return false;
    }

    // Location filter
    if (selectedLocation !== 'all' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }

    // Vehicle type filter
    if (selectedVehicleType !== 'all' && item.vehicleType !== selectedVehicleType) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        item.title.toLowerCase().includes(q) ||
        item.make.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.registrationNumber && item.registrationNumber.toLowerCase().includes(q));
      if (!matches) return false;
    }

    return true;
  });

  const handleEdit = (listing: VehicleMarketplaceListing) => {
    setListingToEdit(listing);
    setIsListingModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle listing?')) {
      await deleteMarketplaceListing(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/bike_rental_nepal_1791704911331.jpg"
              alt="Nepal Bike Marketplace"
              className="w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Nepal Bike & Vehicle Marketplace</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Buy, Sell & Rent Bikes Directly From Owners
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Rent touring bikes for Pokhara and Mustang expeditions, or sell your motorcycle with verified Bluebook documentation and 0% middlemen commission.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setListingToEdit(null);
                  setIsListingModalOpen(true);
                }}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>List Your Bike / Vehicle</span>
              </button>

              <button
                onClick={() => setActiveTab('rent')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-2"
              >
                <Bike className="w-4 h-4 text-teal-300" />
                <span>Explore Rentals</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            {/* Purpose Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Vehicles ({marketplaceListings.length})
              </button>

              <button
                onClick={() => setActiveTab('rent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'rent'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Motorcycles for Rent</span>
              </button>

              <button
                onClick={() => setActiveTab('sale')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'sale'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Vehicles for Sale</span>
              </button>

              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'my'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                My Listings ({userMarketplaceListings.length})
              </button>
            </div>

            {/* List Vehicle CTA */}
            <button
              onClick={() => {
                setListingToEdit(null);
                setIsListingModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>
          </div>

          {/* Search & Location Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search bike, model (Himalayan, Pulsar, Dio, Creta), location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5" /> City:
              </span>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedLocation === loc
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {loc === 'all' ? 'All Cities' : loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Bike className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No vehicle listings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or be the first to list a bike or scooter in your city!
            </p>
            <button
              onClick={() => {
                setListingToEdit(null);
                setIsListingModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isOwner = listing.ownerId === user?.uid || listing.ownerId === 'demo-user-123';
              const isRental = listing.listingType === 'rental' || listing.listingType === 'both';
              const isSale = listing.listingType === 'sale' || listing.listingType === 'both';

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={listing.images[0] || '/src/assets/images/bike_rental_nepal_1791704911331.jpg'}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Listing Badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {listing.listingType === 'rental' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-teal-600 text-white shadow-sm">
                            For Rent
                          </span>
                        )}
                        {listing.listingType === 'sale' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white shadow-sm">
                            For Sale
                          </span>
                        )}
                        {listing.listingType === 'both' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-600 text-white shadow-sm">
                            Rent & Sale
                          </span>
                        )}
                      </div>

                      {/* Location Badge */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        <span>{listing.location}</span>
                      </div>

                      {/* Status Overlay if not active */}
                      {listing.status !== 'active' && (
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                            {listing.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">{listing.make}</span>
                          <span>{listing.manufactureYear}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {listing.title}
                        </h3>
                      </div>

                      {/* Specs pills */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 py-1 border-y border-slate-100">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          {listing.odometerKm.toLocaleString()} km
                        </span>
                        {listing.registrationNumber && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {listing.registrationNumber}
                          </span>
                        )}
                        {listing.includesHelmets && (
                          <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            🪖 Helmet Incl.
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Owner details */}
                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                        <span>Owner: <strong className="text-slate-800">{listing.ownerName}</strong></span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions & Pricing Footer */}
                  <div className="p-5 pt-3 border-t border-slate-100 space-y-3">
                    {/* Price display */}
                    <div className="flex items-baseline justify-between">
                      {isRental && (
                        <div>
                          <span className="text-base font-extrabold text-teal-800 tabular-nums">
                            {formatNpr(listing.rentalRateDailyNpr || 0)}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1">/ day</span>
                        </div>
                      )}
                      {isSale && (
                        <div className="text-right">
                          <span className="text-base font-extrabold text-slate-900 tabular-nums">
                            {formatNpr(listing.salePriceNpr || 0)}
                          </span>
                          {listing.isPriceNegotiable && (
                            <span className="text-[10px] text-emerald-600 block">Negotiable</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    {isOwner ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        {isRental && (
                          <button
                            onClick={() => setSelectedForRental(listing)}
                            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Rent Bike</span>
                          </button>
                        )}
                        {isSale && (
                          <button
                            onClick={() => setSelectedForOffer(listing)}
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Buy / Offer</span>
                          </button>
                        )}
                        <a
                          href={`tel:${listing.ownerPhone}`}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title="Call Owner"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Listing Modal */}
      <VehicleListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setListingToEdit(null);
        }}
        listingToEdit={listingToEdit}
      />

      {/* Rental Booking Modal */}
      <RentalBookingModal
        isOpen={Boolean(selectedForRental)}
        onClose={() => setSelectedForRental(null)}
        listing={selectedForRental}
      />

      {/* Offer Modal */}
      <OfferModal
        isOpen={Boolean(selectedForOffer)}
        onClose={() => setSelectedForOffer(null)}
        listing={selectedForOffer}
      />
    </div>
  );
};
