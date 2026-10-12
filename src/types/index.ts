export type UserRole = 'customer' | 'workshop' | 'roadside' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  city?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  // If provider
  providerApplicationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  providerBusinessName?: string;
}

export type VehicleType = 
  | 'motorcycle' 
  | 'scooter' 
  | 'car' 
  | 'suv' 
  | 'ev' 
  | 'commercial' 
  | 'other';

export type FuelType = 
  | 'petrol' 
  | 'diesel' 
  | 'electric' 
  | 'hybrid' 
  | 'cng' 
  | 'other';

export interface Vehicle {
  id: string;
  ownerId: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  manufactureYear: number;
  registrationNumber: string; // e.g. Ba 2 Cha 8891 or Bagmati 01-025 Cha 1122
  chassisNumber?: string;
  engineNumber?: string;
  fuelType: FuelType;
  currentOdometer: number;
  odometerUnit: 'km' | 'miles';
  purchaseDate?: string;
  vehiclePhoto?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'general_servicing'
  | 'engine_repair'
  | 'brake_service'
  | 'tire_service'
  | 'battery_service'
  | 'ev_diagnostics'
  | 'ac_repair'
  | 'electrical_repair'
  | 'suspension'
  | 'bodywork'
  | 'oil_change'
  | 'other';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  userId: string;
  serviceCategory: ServiceCategory;
  serviceDate: string;
  odometerReading: number;
  workshopName: string;
  description: string;
  partsReplaced: string[];
  labourCostNpr: number;
  partsCostNpr: number;
  totalCostNpr: number;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  invoiceUrl?: string;
  invoiceFileName?: string;
  createdAt: string;
}

export type DocumentType = 
  | 'bluebook'            // Savari Darta Pramanpatra
  | 'vehicle_tax'         // Sawari Kar (Annual Road Tax)
  | 'insurance'           // Third Party or Comprehensive
  | 'pollution_test'      // Green sticker / Emission certificate
  | 'driving_licence'
  | 'other';

export interface VehicleDocument {
  id: string;
  userId: string;
  vehicleId: string;
  documentType: DocumentType;
  title: string;
  referenceNumber: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  remindDaysBefore: number[]; // e.g. [30, 7, 1]
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface ServiceBooking {
  id: string;
  bookingRef: string; // e.g. WOP-BK-8921
  userId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleSummary: string; // e.g. "Hyundai Creta (Ba 2 Cha 1234)"
  providerId: string;
  providerName: string;
  serviceCategory: ServiceCategory;
  bookingType: 'workshop_visit' | 'pickup_drop';
  preferredDate: string;
  preferredTimeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  problemDescription: string;
  pickupAddress?: string;
  pickupNotes?: string;
  estimatedCostNpr?: number;
  actualCostNpr?: number;
  status: BookingStatus;
  providerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PickupDropStatus = 
  | 'requested'
  | 'confirmed'
  | 'driver_assigned'
  | 'vehicle_collected'
  | 'vehicle_returned'
  | 'cancelled';

export interface PickupDropRequest {
  id: string;
  bookingId: string;
  userId: string;
  vehicleId: string;
  pickupAddress: string;
  dropAddress: string;
  contactNumber: string;
  preferredSchedule: string;
  feeNpr: number;
  driverName?: string;
  driverPhone?: string;
  specialInstructions?: string;
  status: PickupDropStatus;
  createdAt: string;
  updatedAt: string;
}

export type EmergencyType = 
  | 'breakdown'
  | 'towing'
  | 'battery_jump_start'
  | 'tire_puncture'
  | 'ev_support'
  | 'fuel_delivery'
  | 'lockout'
  | 'mechanical_emergency';

export type EmergencyStatus = 
  | 'requested'
  | 'accepted'
  | 'provider_assigned'
  | 'on_the_way'
  | 'resolved'
  | 'cancelled';

export interface EmergencyRequest {
  id: string;
  sosRef: string; // e.g. WOP-SOS-4491
  userId: string;
  userName: string;
  contactPhone: string;
  vehicleId?: string;
  vehicleSummary: string;
  emergencyType: EmergencyType;
  description: string;
  locationAddress: string;
  latitude?: number;
  longitude?: number;
  status: EmergencyStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedProviderPhone?: string;
  estimatedArrivalMinutes?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface ServiceProvider {
  id: string;
  userId?: string;
  businessName: string;
  providerType: 'workshop' | 'roadside' | 'both';
  contactPhone: string;
  email: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpenNow: boolean;
  operatingHours: string;
  supportedServices: ServiceCategory[];
  supportedVehicleTypes: VehicleType[];
  pickupDropAvailable: boolean;
  baseInspectionFeeNpr: number;
  description: string;
  imageUrl?: string;
}

export interface SparePart {
  id: string;
  name: string;
  category: 'Brakes' | 'Engine Oil & Fluids' | 'Filters' | 'Batteries' | 'Tires' | 'Electrical' | 'Suspension' | 'Transmission' | 'Accessories';
  compatibleVehicles: string[];
  partNumber: string;
  supplierName: string;
  supplierPhone: string;
  priceNpr: number;
  originalPriceNpr?: number;
  inStock: boolean;
  stockCount: number;
  discountPercentage?: number;
  imageUrl?: string;
  description: string;
  isOemVerified: boolean;
}

export interface PartEnquiry {
  id: string;
  partId: string;
  partName: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  vehicleModel: string;
  message: string;
  status: 'new' | 'contacted' | 'fulfilled' | 'closed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  timestamp: string;
  details: string;
}

export type MarketplaceListingType = 'sale' | 'rental' | 'both';
export type MarketplaceListingStatus = 'active' | 'sold' | 'rented' | 'inactive';

export interface VehicleMarketplaceListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  listingType: MarketplaceListingType;
  title: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  manufactureYear: number;
  odometerKm: number;
  registrationNumber?: string;
  // Sale details
  salePriceNpr?: number;
  isPriceNegotiable?: boolean;
  // Rental details
  rentalRateDailyNpr?: number;
  rentalRateWeeklyNpr?: number;
  rentalSecurityDepositNpr?: number;
  includesHelmets?: boolean;
  rentalRequirements?: string;
  // General info
  location: string; // e.g. Kathmandu, Pokhara, Lalitpur, Chitwan
  description: string;
  images: string[];
  status: MarketplaceListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  part: SparePart;
  quantity: number;
}

export interface PartsOrder {
  id: string;
  orderRef: string; // e.g. WOP-ORD-8821
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: 'cod' | 'esewa' | 'khalti';
  items: {
    partId: string;
    name: string;
    priceNpr: number;
    quantity: number;
  }[];
  subtotalNpr: number;
  deliveryFeeNpr: number;
  totalAmountNpr: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
}

