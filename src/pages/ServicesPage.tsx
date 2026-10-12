import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ServiceProvider, ServiceCategory, VehicleType } from '../types';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { formatNpr, SERVICE_CATEGORIES } from '../lib/formatters';
import { Wrench, MapPin, Phone, Star, Shield, Clock, Search, Filter } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { providers, userVehicles, createBooking } = useData();

  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = providers.filter((p) => {
    const matchesCity = cityFilter === 'all' || p.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || p.supportedServices.includes(categoryFilter as ServiceCategory);
    const matchesSearch = 
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Approved Automotive Service Centers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified workshops, multi-brand EV diagnostic bays, and precision pitstops in Nepal.
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by workshop name or area (e.g. Tinkune, Teku)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Locations</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Pokhara">Pokhara</option>
            </select>

            {/* Service Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Service Specialties</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Workshops Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {provider.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{provider.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{provider.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {provider.description}
                </p>

                {/* Operating hours & hotline */}
                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{provider.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{provider.contactPhone}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {provider.supportedServices.slice(0, 3).map((srv) => (
                    <span
                      key={srv}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium capitalize"
                    >
                      {srv.replace('_', ' ')}
                    </span>
                  ))}
                  {provider.supportedServices.length > 3 && (
                    <span className="text-[10px] text-slate-400">
                      +{provider.supportedServices.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Inspection Fee</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatNpr(provider.baseInspectionFeeNpr)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedProviderForBooking(provider.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BookingWizardModal
        isOpen={Boolean(selectedProviderForBooking)}
        onClose={() => setSelectedProviderForBooking(null)}
        vehicles={userVehicles}
        providers={providers}
        defaultProviderId={selectedProviderForBooking || undefined}
        onSubmitBooking={createBooking}
      />
    </div>
  );
};
