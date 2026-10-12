import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Car, 
  Shield, 
  AlertTriangle, 
  FileText, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Sparkles,
  PhoneCall,
  Bike,
  Award,
  Mountain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/src/assets/images/hero_automotive_service_1791636519717.jpg"
            alt="WheelOnPalm Automotive Workshop"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Tailored for Nepal Vehicle Owners & Fleets</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Your Vehicle. <br />
              Your Services. <br />
              <span className="text-teal-400">All in Your Palm.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 text-balance leading-relaxed">
              WheelOnPalm is Nepal’s complete automotive platform connecting vehicle owners with certified workshops, 24/7 roadside rescue, bluebook renewal alerts, and genuine OEM parts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 text-sm"
              >
                <span>{user ? 'Open My Dashboard' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/sos"
                className="px-6 py-3.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/10"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>Emergency SOS Help</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-xl font-bold text-white tabular-nums block">100%</span>
                <span className="text-slate-400">Verified Nepal Workshops</span>
              </div>
              <div>
                <span className="text-xl font-bold text-teal-400 tabular-nums block">NPR</span>
                <span className="text-slate-400">Transparent Pricing</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white tabular-nums block">24/7</span>
                <span className="text-slate-400">Roadside Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Complete Vehicle Care Without the Chaos
          </h2>
          <p className="text-sm text-slate-600">
            Never lose your bluebook expiry date, get stranded on Prithvi Highway, or wonder what was repaired on your car.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Garage & Bluebook */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Digital Garage & Bluebook Vault</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Store multiple bikes, cars, or commercial vehicles with masked chassis and engine numbers. Automated reminders for Savari Darta (Bluebook), Sawari Kar (Tax), and Green Sticker emission tests.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>30, 7, and 1-day advance renewal alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Private encrypted document file vault</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Verified Service Booking */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Workshop Booking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule periodic servicing, EV diagnostics, or brake overhaul with verified workshops in Kathmandu, Lalitpur, and Pokhara. Choose self-drive or doorstep valet pickup & return.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Upfront estimated costs in Nepalese Rupees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Real-time appointment slot booking</span>
              </li>
            </ul>
          </div>

          {/* Card 3: 24/7 Roadside SOS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">24/7 Emergency Roadside SOS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stuck with a puncture, dead battery, or overheated engine? Send a high-priority SOS alert with your GPS coordinates to authorized recovery vehicles along Nepal’s highway networks.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Towing, jump-start, and puncture mobile units</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>One-tap access to Nepal Traffic Police (103)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Genuine Parts & Highlights Banner */}
      <section className="bg-slate-900 text-white py-14 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                Nepal Automotive Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Genuine OEM Spare Parts & Consumables
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct connections to verified parts distributors in Teku, Kupandole, and Tinkune. Castrol synthetic oils, Brembo brake rotors, Bosch filtration, and Exide batteries with certified warranty.
              </p>
              <div className="pt-2">
                <Link
                  to="/parts"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                  <span>Browse Spare Parts Catalog</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <img
                src="/src/assets/images/auto_parts_catalog_1791636541696.jpg"
                alt="Automotive Spare Parts Nepal"
                className="w-full h-64 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Peer-to-Peer Bike Marketplace & Rental Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative order-2 lg:order-1">
            <img
              src="/src/assets/images/bike_rental_nepal_1791704911331.jpg"
              alt="Himalayan Bike Rental in Pokhara"
              className="w-full h-72 sm:h-96 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl text-white border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
                  Featured Rental
                </span>
                <span className="text-sm font-bold block">Royal Enfield Himalayan 411cc</span>
                <span className="text-xs text-slate-400">Pokhara Lakeside · NPR 2,200/day</span>
              </div>
              <Link
                to={user ? "/marketplace" : "/signup"}
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Rent Now
              </Link>
            </div>
          </div>

          <div className="space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Bike className="w-4 h-4 text-teal-600" />
              <span>Direct Bike Owner Marketplace</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Rent or Sell Your Motorcycle Direct with 0% Middlemen Cut
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Planning a trip to Mustang, Pokhara, or Begnas Lake? Rent adventure bikes with helmets and panniers directly from local owners. Or list your bike for immediate sale with verified digital bluebook logs.
            </p>

            <ul className="text-xs text-slate-700 space-y-2.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Transparent daily/weekly rental rates & refundable deposit calculator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Facility to upload vehicle pictures and complete technical specifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Direct WhatsApp and phone negotiation without dealership commission</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to={user ? "/marketplace" : "/signup"}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Explore Bike Marketplace</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 50-Year Entrepreneur Wisdom Section */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>50-Year Master Automotive Entrepreneur Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              उस्तादजी (Ustad-Ji) Vehicle Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Honed across 50 years of managing fleet garages, dealership trading, and mountain highway rescues across Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block text-sm">
                🔍 Scam & Odometer Rollback Detection
              </span>
              <p className="text-slate-300 leading-relaxed">
                Step-by-step physical tests for hot oil filler blowby, subframe accident re-welds, and pedal rubber wear correlation.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-teal-400 font-bold block text-sm">
                🏔️ Himalayan Ghat-Pass Wear Simulator
              </span>
              <p className="text-slate-300 leading-relaxed">
                Calculates severe strain multipliers for Mugling-Narayanghat landslides, BP Highway hairpins, and Terai monsoon rust.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">
                💰 Nepal Tax Backlog Penalty Calculator
              </span>
              <p className="text-slate-300 leading-relaxed">
                Instant calculations of compound fines and Department of Transport late renewal surcharges before you buy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-12 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-white text-sm">WheelOnPalm</span>
              <span className="text-slate-500">· Kathmandu, Nepal</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service & Privacy
              </Link>
              <Link to="/sos" className="text-red-400 hover:text-red-300 transition-colors">
                Emergency Helplines (103 / 100)
              </Link>
            </div>

            <div className="text-slate-500">
              © {new Date().getFullYear()} WheelOnPalm. Built for Nepal automotive mobility.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
