import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { 
  VehicleMarketplaceListing, 
  MarketplaceListingType, 
  VehicleType, 
  Vehicle 
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Upload, 
  Car, 
  Bike, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  Check, 
  Sparkles, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface VehicleListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: Vehicle | null;
  listingToEdit?: VehicleMarketplaceListing | null;
}

export const VehicleListingModal: React.FC<VehicleListingModalProps> = ({
  isOpen,
  onClose,
  initialVehicle,
  listingToEdit,
}) => {
  const { user } = useAuth();
  const { userVehicles, createMarketplaceListing, updateMarketplaceListing } = useData();

  const [listingType, setListingType] = useState<MarketplaceListingType>('rental');
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [selectedGarageVehicleId, setSelectedGarageVehicleId] = useState<string>('');
  
  const [title, setTitle] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [manufactureYear, setManufactureYear] = useState<number>(new Date().getFullYear() - 1);
  const [odometerKm, setOdometerKm] = useState<number>(12000);
  const [registrationNumber, setRegistrationNumber] = useState('');
  
  // Sale details
  const [salePriceNpr, setSalePriceNpr] = useState<number>(220000);
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(true);

  // Rental details
  const [rentalRateDailyNpr, setRentalRateDailyNpr] = useState<number>(1800);
  const [rentalRateWeeklyNpr, setRentalRateWeeklyNpr] = useState<number>(11000);
  const [rentalSecurityDepositNpr, setRentalSecurityDepositNpr] = useState<number>(8000);
  const [includesHelmets, setIncludesHelmets] = useState(true);
  const [rentalRequirements, setRentalRequirements] = useState(
    'Valid motorcycle licence, citizenship or passport ID deposit, return with same fuel level.'
  );

  // General details
  const [location, setLocation] = useState('Kathmandu (Baneshwor)');
  const [ownerPhone, setOwnerPhone] = useState(user?.phoneNumber || '+977 9841234567');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/bike_rental_nepal_1791704911331.jpg');
  const [imagePreview, setImagePreview] = useState<string>('/src/assets/images/bike_rental_nepal_1791704911331.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preset images for convenience
  const PRESET_IMAGES = [
    { label: 'Himalayan Adventure Bike', url: '/src/assets/images/bike_rental_nepal_1791704911331.jpg' },
    { label: 'Sport Naked Motorcycle', url: '/src/assets/images/bike_sale_nepal_1791704928683.jpg' },
    { label: 'Automotive Workshop Bay', url: '/src/assets/images/hero_automotive_service_1791636519717.jpg' },
  ];

  useEffect(() => {
    if (listingToEdit) {
      setListingType(listingToEdit.listingType);
      setVehicleType(listingToEdit.vehicleType);
      setTitle(listingToEdit.title);
      setMake(listingToEdit.make);
      setModel(listingToEdit.model);
      setManufactureYear(listingToEdit.manufactureYear);
      setOdometerKm(listingToEdit.odometerKm);
      setRegistrationNumber(listingToEdit.registrationNumber || '');
      setSalePriceNpr(listingToEdit.salePriceNpr || 200000);
      setIsPriceNegotiable(listingToEdit.isPriceNegotiable ?? true);
      setRentalRateDailyNpr(listingToEdit.rentalRateDailyNpr || 1500);
      setRentalRateWeeklyNpr(listingToEdit.rentalRateWeeklyNpr || 9000);
      setRentalSecurityDepositNpr(listingToEdit.rentalSecurityDepositNpr || 7000);
      setIncludesHelmets(listingToEdit.includesHelmets ?? true);
      setRentalRequirements(listingToEdit.rentalRequirements || '');
      setLocation(listingToEdit.location);
      setOwnerPhone(listingToEdit.ownerPhone);
      setDescription(listingToEdit.description);
      setImageUrl(listingToEdit.images[0] || '/src/assets/images/bike_rental_nepal_1791704911331.jpg');
      setImagePreview(listingToEdit.images[0] || '/src/assets/images/bike_rental_nepal_1791704911331.jpg');
    } else if (initialVehicle) {
      populateFromVehicle(initialVehicle);
    }
  }, [listingToEdit, initialVehicle]);

  const populateFromVehicle = (veh: Vehicle) => {
    setSelectedGarageVehicleId(veh.id);
    setVehicleType(veh.vehicleType);
    setMake(veh.make);
    setModel(veh.model);
    setManufactureYear(veh.manufactureYear);
    setOdometerKm(veh.currentOdometer);
    setRegistrationNumber(veh.registrationNumber);
    setTitle(`${veh.make} ${veh.model} (${veh.manufactureYear})`);
    setDescription(
      `Well-maintained ${veh.make} ${veh.model} with verified digital service logs on WheelOnPalm. Registration number: ${veh.registrationNumber}.`
    );
    if (veh.vehiclePhoto) {
      setImageUrl(veh.vehiclePhoto);
      setImagePreview(veh.vehiclePhoto);
    }
  };

  const handleGarageSelect = (vehId: string) => {
    setSelectedGarageVehicleId(vehId);
    const target = userVehicles.find((v) => v.id === vehId);
    if (target) {
      populateFromVehicle(target);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !make.trim() || !model.trim()) {
      setError('Please provide title, make, and model.');
      return;
    }

    if ((listingType === 'sale' || listingType === 'both') && (!salePriceNpr || salePriceNpr <= 0)) {
      setError('Please provide a valid sale price in NPR.');
      return;
    }

    if ((listingType === 'rental' || listingType === 'both') && (!rentalRateDailyNpr || rentalRateDailyNpr <= 0)) {
      setError('Please provide a daily rental rate in NPR.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (listingToEdit) {
        await updateMarketplaceListing(listingToEdit.id, {
          listingType,
          vehicleType,
          title,
          make,
          model,
          manufactureYear: Number(manufactureYear),
          odometerKm: Number(odometerKm),
          registrationNumber,
          salePriceNpr: (listingType === 'sale' || listingType === 'both') ? Number(salePriceNpr) : undefined,
          isPriceNegotiable,
          rentalRateDailyNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalRateDailyNpr) : undefined,
          rentalRateWeeklyNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalRateWeeklyNpr) : undefined,
          rentalSecurityDepositNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalSecurityDepositNpr) : undefined,
          includesHelmets,
          rentalRequirements,
          location,
          ownerPhone,
          description,
          images: [imageUrl],
        });
      } else {
        await createMarketplaceListing({
          ownerId: user?.uid || 'demo-user-123',
          ownerName: user?.fullName || 'Verified Vehicle Owner',
          ownerPhone,
          ownerEmail: user?.email || '',
          listingType,
          vehicleType,
          title,
          make,
          model,
          manufactureYear: Number(manufactureYear),
          odometerKm: Number(odometerKm),
          registrationNumber,
          salePriceNpr: (listingType === 'sale' || listingType === 'both') ? Number(salePriceNpr) : undefined,
          isPriceNegotiable,
          rentalRateDailyNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalRateDailyNpr) : undefined,
          rentalRateWeeklyNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalRateWeeklyNpr) : undefined,
          rentalSecurityDepositNpr: (listingType === 'rental' || listingType === 'both') ? Number(rentalSecurityDepositNpr) : undefined,
          includesHelmets,
          rentalRequirements,
          location,
          description: description || 'Genuine vehicle listed by verified owner with clean documentation.',
          images: [imageUrl],
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={listingToEdit ? 'Edit Vehicle Listing' : 'List Vehicle for Sale or Rent'}
      subtitle="Publish your bike, scooter, or vehicle on Nepal's largest automotive network."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Quick Import from Garage */}
        {userVehicles.length > 0 && !listingToEdit && (
          <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                1-Click Autofill from Your Digital Garage
              </span>
              <span className="text-[10px] text-teal-700 font-medium">Saves time</span>
            </div>
            <select
              value={selectedGarageVehicleId}
              onChange={(e) => handleGarageSelect(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">-- Choose a registered vehicle to auto-populate --</option>
              {userVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.registrationNumber}) - {v.vehicleType}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2. Listing Purpose Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Listing Purpose *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setListingType('rental')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                listingType === 'rental'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏍️ For Rent
            </button>
            <button
              type="button"
              onClick={() => setListingType('sale')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                listingType === 'sale'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏷️ For Sale
            </button>
            <button
              type="button"
              onClick={() => setListingType('both')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                listingType === 'both'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              ⚡ Rent & Sale
            </button>
          </div>
        </div>

        {/* 3. Vehicle Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Enfield Himalayan 411cc BS6 (Adventure Touring Ready)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Type *
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="motorcycle">Motorcycle / Bike</option>
              <option value="scooter">Scooter</option>
              <option value="car">Car / Hatchback / Sedan</option>
              <option value="suv">SUV / 4x4 Jeep</option>
              <option value="ev">Electric Vehicle (EV)</option>
              <option value="commercial">Commercial / Van</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Make / Brand *
            </label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Royal Enfield, Bajaj, Honda, Yamaha"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Model *
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Himalayan, Pulsar NS200, Dio, MT-15"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacture Year
            </label>
            <input
              type="number"
              min="1980"
              max={new Date().getFullYear()}
              value={manufactureYear}
              onChange={(e) => setManufactureYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Odometer (km)
            </label>
            <input
              type="number"
              min="0"
              value={odometerKm}
              onChange={(e) => setOdometerKm(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Number (Nepal)
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. Ba 02 Pa 9921 or Bagmati 03 Pa 7890"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* 4. Pricing: Rental or Sale */}
        {(listingType === 'rental' || listingType === 'both') && (
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-teal-600" />
              Rental Rates & Terms (NPR)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Daily Rate (NPR/day) *
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={rentalRateDailyNpr}
                  onChange={(e) => setRentalRateDailyNpr(Number(e.target.value))}
                  placeholder="e.g. 1800"
                  className="w-full px-3 py-2 text-xs bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Weekly Rate (NPR/week)
                </label>
                <input
                  type="number"
                  min="500"
                  value={rentalRateWeeklyNpr}
                  onChange={(e) => setRentalRateWeeklyNpr(Number(e.target.value))}
                  placeholder="e.g. 11000"
                  className="w-full px-3 py-2 text-xs bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Security Deposit (NPR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={rentalSecurityDepositNpr}
                  onChange={(e) => setRentalSecurityDepositNpr(Number(e.target.value))}
                  placeholder="e.g. 8000"
                  className="w-full px-3 py-2 text-xs bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="helmets"
                checked={includesHelmets}
                onChange={(e) => setIncludesHelmets(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <label htmlFor="helmets" className="text-xs text-slate-700 font-medium">
                Includes DOT / ISI approved helmet(s) for rider
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Rental Requirements & Rules
              </label>
              <input
                type="text"
                value={rentalRequirements}
                onChange={(e) => setRentalRequirements(e.target.value)}
                placeholder="e.g. Valid driving licence, citizenship card copy, fuel return policy"
                className="w-full px-3 py-2 text-xs bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {(listingType === 'sale' || listingType === 'both') && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Sale Price & Terms (NPR)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Selling Price (NPR) *
                </label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={salePriceNpr}
                  onChange={(e) => setSalePriceNpr(Number(e.target.value))}
                  placeholder="e.g. 265000"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isPriceNegotiable}
                  onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
                <label htmlFor="negotiable" className="text-xs text-slate-700 font-medium">
                  Price is negotiable (हल्का मिलाएर दिन सकिन्छ)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 5. Photo Upload Facility */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Vehicle Picture & Media *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Image Preview Box */}
            <div className="sm:col-span-1 border border-slate-200 rounded-2xl p-2 bg-slate-50 flex flex-col items-center justify-center min-h-[140px] overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vehicle Preview"
                  className="w-full h-32 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Upload className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-[10px]">No image selected</span>
                </div>
              )}
            </div>

            {/* Upload Options */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>Upload Photo from Device (JPG/PNG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Or select from quality vehicle presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setImagePreview(preset.url);
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        imageUrl === preset.url
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste external image URL..."
                  className="w-full px-3 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Location, Contact & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location in Nepal *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kathmandu (Baneshwor / Teku) or Pokhara (Lakeside)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone / WhatsApp *
            </label>
            <input
              type="text"
              required
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="+977 98XXXXXXXX"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Description & Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, servicing frequency, accessories included, tire health, and bluebook status..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{listingToEdit ? 'Update Listing' : 'Publish Listing'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
