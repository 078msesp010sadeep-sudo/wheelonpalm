import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { VehicleMarketplaceListing } from '../../types';
import { formatNpr } from '../../lib/formatters';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Bike, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  Phone, 
  CheckCircle2, 
  User, 
  FileText 
} from 'lucide-react';

interface RentalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: VehicleMarketplaceListing | null;
}

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({
  isOpen,
  onClose,
  listing,
}) => {
  const { user } = useAuth();

  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [days, setDays] = useState<number>(3);
  const [driverName, setDriverName] = useState(user?.fullName || '');
  const [driverPhone, setDriverPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [licenseNumber, setLicenseNumber] = useState('01-06-00987654');
  const [pickupCity, setPickupCity] = useState(listing?.location || 'Kathmandu');
  const [specialNote, setSpecialNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!listing) return null;

  const dailyRate = listing.rentalRateDailyNpr || 1500;
  const deposit = listing.rentalSecurityDepositNpr || 8000;
  const rentalTotal = dailyRate * days;
  const grandTotal = rentalTotal + deposit;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSuccess ? handleReset : onClose}
      title={isSuccess ? 'Rental Request Submitted!' : `Rent: ${listing.title}`}
      subtitle={
        isSuccess
          ? 'Owner notified via SMS & WheelOnPalm network.'
          : 'Direct peer-to-peer bike rental with transparent deposit protection.'
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="space-y-5 text-center py-4">
          <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Booking Request Received!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your rental request for the <strong>{listing.make} {listing.model}</strong> has been transmitted to owner <strong>{listing.ownerName}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Rental Duration:</span>
              <strong className="text-slate-900">{days} Days (Starts {startDate})</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rental Fee:</span>
              <strong className="text-slate-900">{formatNpr(rentalTotal)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Refundable Deposit:</span>
              <strong className="text-emerald-700">{formatNpr(deposit)}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-800 font-bold">
              <span>Total Payable to Owner:</span>
              <span>{formatNpr(grandTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs text-left flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Owner Direct Contact:</span>
              <span className="font-mono text-xs">{listing.ownerPhone}</span>
              <span className="block text-[10px] text-teal-700 mt-0.5">
                Feel free to call or WhatsApp to confirm vehicle handover location.
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleBook} className="space-y-5">
          {/* Vehicle mini badge */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={listing.images[0] || '/src/assets/images/bike_rental_nepal_1791704911331.jpg'}
              alt={listing.title}
              className="w-14 h-14 object-cover rounded-xl shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                {listing.location}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {listing.title}
              </h4>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {formatNpr(dailyRate)} <span className="text-[10px] text-slate-500 font-normal">/ day</span>
              </span>
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Rental Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="60"
                required
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
              />
            </div>
          </div>

          {/* Driver Information */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Rider Full Name *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Rider name as per driving license"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nepal Driving Licence No. *
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. 01-06-00123456"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Special Note / Planned Destination
              </label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Touring Sarangkot & Begnas Lake, need 2 helmets"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Daily Rate ({formatNpr(dailyRate)} × {days} days):</span>
              <strong className="text-slate-900 tabular-nums">{formatNpr(rentalTotal)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Refundable Security Deposit:
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              </span>
              <strong className="text-slate-900 tabular-nums">{formatNpr(deposit)}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Estimated:</span>
              <span className="text-teal-700 tabular-nums">{formatNpr(grandTotal)}</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              * The security deposit is fully refunded by the owner upon return of the vehicle with clean inspection.
            </span>
          </div>

          {/* Actions */}
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
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Send Rental Request</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
