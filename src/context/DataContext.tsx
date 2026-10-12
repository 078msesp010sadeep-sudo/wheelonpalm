import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Vehicle, 
  MaintenanceRecord, 
  VehicleDocument, 
  ServiceBooking, 
  PickupDropRequest,
  EmergencyRequest, 
  ServiceProvider, 
  SparePart, 
  PartEnquiry, 
  AuditLog,
  BookingStatus,
  EmergencyStatus,
  PickupDropStatus,
  VehicleMarketplaceListing,
  MarketplaceListingStatus,
  CartItem,
  PartsOrder
} from '../types';
import { 
  INITIAL_PROVIDERS, 
  INITIAL_SPARE_PARTS, 
  INITIAL_DEMO_VEHICLES, 
  INITIAL_DEMO_RECORDS, 
  INITIAL_DEMO_DOCUMENTS, 
  INITIAL_DEMO_BOOKINGS,
  INITIAL_MARKETPLACE_LISTINGS
} from '../lib/mockData';
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface DataContextType {
  vehicles: Vehicle[];
  userVehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  documents: VehicleDocument[];
  bookings: ServiceBooking[];
  userBookings: ServiceBooking[];
  pickupDropRequests: PickupDropRequest[];
  emergencyRequests: EmergencyRequest[];
  userEmergencyRequests: EmergencyRequest[];
  providers: ServiceProvider[];
  spareParts: SparePart[];
  partEnquiries: PartEnquiry[];
  auditLogs: AuditLog[];
  savedPartIds: string[];

  // Marketplace (Buy, Sell, Rent)
  marketplaceListings: VehicleMarketplaceListing[];
  userMarketplaceListings: VehicleMarketplaceListing[];
  createMarketplaceListing: (listing: Omit<VehicleMarketplaceListing, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateMarketplaceListing: (id: string, updates: Partial<VehicleMarketplaceListing>) => Promise<void>;
  deleteMarketplaceListing: (id: string) => Promise<void>;
  markListingStatus: (id: string, status: MarketplaceListingStatus) => Promise<void>;

  // E-Commerce Parts Shop & Orders
  cart: CartItem[];
  addToCart: (part: SparePart, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateCartQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  partsOrders: PartsOrder[];
  userPartsOrders: PartsOrder[];
  createPartsOrder: (orderData: Omit<PartsOrder, 'id' | 'orderRef' | 'createdAt' | 'status'>) => Promise<string>;

  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  // Maintenance operations
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => Promise<string>;
  deleteMaintenanceRecord: (id: string) => Promise<void>;

  // Document operations
  addDocument: (doc: Omit<VehicleDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDocument: (id: string, updates: Partial<VehicleDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  // Booking operations
  createBooking: (booking: Omit<ServiceBooking, 'id' | 'bookingRef' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus, providerNotes?: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;

  // Pickup & drop operations
  createPickupDrop: (req: Omit<PickupDropRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updatePickupDropStatus: (id: string, status: PickupDropStatus, driverInfo?: { driverName?: string; driverPhone?: string }) => Promise<void>;

  // Emergency SOS operations
  createEmergencyRequest: (sos: Omit<EmergencyRequest, 'id' | 'sosRef' | 'status' | 'createdAt'>) => Promise<string>;
  updateEmergencyStatus: (id: string, status: EmergencyStatus, assignedInfo?: { providerId?: string; providerName?: string; providerPhone?: string; etaMin?: number }) => Promise<void>;

  // Spare parts operations
  submitPartEnquiry: (enquiry: Omit<PartEnquiry, 'id' | 'status' | 'createdAt'>) => Promise<string>;
  toggleSavePart: (partId: string) => void;

  // Provider operations
  updateProviderProfile: (providerId: string, updates: Partial<ServiceProvider>) => Promise<void>;

  // Admin operations
  approveProviderApplication: (applicantUid: string, businessName: string) => Promise<void>;
  rejectProviderApplication: (applicantUid: string, reason: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [pickupDropRequests, setPickupDropRequests] = useState<PickupDropRequest[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>(INITIAL_PROVIDERS);
  const [spareParts, setSpareParts] = useState<SparePart[]>(INITIAL_SPARE_PARTS);
  const [partEnquiries, setPartEnquiries] = useState<PartEnquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [savedPartIds, setSavedPartIds] = useState<string[]>(['part-01']);
  const [marketplaceListings, setMarketplaceListings] = useState<VehicleMarketplaceListing[]>(INITIAL_MARKETPLACE_LISTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [partsOrders, setPartsOrders] = useState<PartsOrder[]>([]);

  // Real-time synchronization with Firestore
  useEffect(() => {
    if (!user) {
      setVehicles(INITIAL_DEMO_VEHICLES);
      setMaintenanceRecords(INITIAL_DEMO_RECORDS);
      setDocuments(INITIAL_DEMO_DOCUMENTS);
      setBookings(INITIAL_DEMO_BOOKINGS);
      setMarketplaceListings(INITIAL_MARKETPLACE_LISTINGS);
      return;
    }

    // 1. Listen to Vehicles
    const vehiclesPath = 'vehicles';
    const vehQuery = user.role === 'admin'
      ? collection(db, vehiclesPath)
      : query(collection(db, vehiclesPath), where('ownerId', '==', user.uid));

    const unsubVehicles = onSnapshot(
      vehQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Vehicle));
        // If empty on first sign in, populate with demo vehicles for instant exploration
        if (loaded.length === 0) {
          setVehicles(INITIAL_DEMO_VEHICLES);
        } else {
          setVehicles(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, vehiclesPath);
      }
    );

    // 2. Listen to Maintenance Records
    const maintPath = 'maintenanceRecords';
    const maintQuery = user.role === 'admin'
      ? collection(db, maintPath)
      : query(collection(db, maintPath), where('userId', '==', user.uid));

    const unsubMaint = onSnapshot(
      maintQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MaintenanceRecord));
        setMaintenanceRecords(loaded.length > 0 ? loaded : INITIAL_DEMO_RECORDS);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, maintPath);
      }
    );

    // 3. Listen to Vehicle Documents
    const docsPath = 'vehicleDocuments';
    const docsQuery = user.role === 'admin'
      ? collection(db, docsPath)
      : query(collection(db, docsPath), where('userId', '==', user.uid));

    const unsubDocs = onSnapshot(
      docsQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VehicleDocument));
        setDocuments(loaded.length > 0 ? loaded : INITIAL_DEMO_DOCUMENTS);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, docsPath);
      }
    );

    // 4. Listen to Bookings
    const bookingsPath = 'bookings';
    const bookingsQuery = user.role === 'admin' || user.role === 'workshop'
      ? collection(db, bookingsPath)
      : query(collection(db, bookingsPath), where('userId', '==', user.uid));

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceBooking));
        setBookings(loaded.length > 0 ? loaded : INITIAL_DEMO_BOOKINGS);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, bookingsPath);
      }
    );

    // 5. Listen to Emergency Requests
    const sosPath = 'emergencyRequests';
    const sosQuery = collection(db, sosPath);
    const unsubSos = onSnapshot(
      sosQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as EmergencyRequest));
        setEmergencyRequests(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, sosPath);
      }
    );

    // 6. Listen to Providers Catalogue
    const provPath = 'serviceProviders';
    const unsubProviders = onSnapshot(
      collection(db, provPath),
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceProvider));
        if (loaded.length > 0) setProviders(loaded);
      },
      (error) => {
        // Fallback to local
      }
    );

    // 7. Listen to Marketplace Listings
    const mktPath = 'marketplaceListings';
    const unsubMarketplace = onSnapshot(
      collection(db, mktPath),
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VehicleMarketplaceListing));
        if (loaded.length > 0) {
          setMarketplaceListings(loaded);
        } else {
          setMarketplaceListings(INITIAL_MARKETPLACE_LISTINGS);
        }
      },
      (error) => {
        // Fallback to local
      }
    );

    // 8. Listen to Parts Orders
    const ordersPath = 'partsOrders';
    const ordersQuery = user.role === 'admin'
      ? collection(db, ordersPath)
      : query(collection(db, ordersPath), where('userId', '==', user.uid));
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PartsOrder));
        setPartsOrders(loaded);
      },
      (error) => {
        // Fallback to local
      }
    );

    return () => {
      unsubVehicles();
      unsubMaint();
      unsubDocs();
      unsubBookings();
      unsubSos();
      unsubProviders();
      unsubMarketplace();
      unsubOrders();
    };
  }, [user]);

  const currentUid = user?.uid || 'demo-user-123';
  const userVehicles = vehicles.filter((v) => v.ownerId === currentUid || v.ownerId === 'demo-user-123');
  const userBookings = bookings.filter((b) => b.userId === currentUid || b.userId === 'demo-user-123');
  const userEmergencyRequests = emergencyRequests.filter((e) => e.userId === currentUid || e.userId === 'demo-user-123');
  const userMarketplaceListings = marketplaceListings.filter((m) => m.ownerId === currentUid || m.ownerId === 'demo-user-123');
  const userPartsOrders = partsOrders.filter((o) => o.userId === currentUid || o.userId === 'demo-user-123');

  // MUTATIONS

  const addVehicle = async (vehData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = 'veh-' + Math.random().toString(36).substring(2, 9);
    const newVehicle: Vehicle = {
      ...vehData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const path = `vehicles/${id}`;
    try {
      await setDoc(doc(db, 'vehicles', id), newVehicle);
      setVehicles((prev) => [newVehicle, ...prev]);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      return id;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<void> => {
    const path = `vehicles/${id}`;
    try {
      await updateDoc(doc(db, 'vehicles', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteVehicle = async (id: string): Promise<void> => {
    const path = `vehicles/${id}`;
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addMaintenanceRecord = async (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Promise<string> => {
    const id = 'maint-' + Math.random().toString(36).substring(2, 9);
    const newRecord: MaintenanceRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
    };

    const path = `maintenanceRecords/${id}`;
    try {
      await setDoc(doc(db, 'maintenanceRecords', id), newRecord);
      setMaintenanceRecords((prev) => [newRecord, ...prev]);

      if (record.odometerReading) {
        updateVehicle(record.vehicleId, { currentOdometer: record.odometerReading });
      }
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      return id;
    }
  };

  const deleteMaintenanceRecord = async (id: string): Promise<void> => {
    const path = `maintenanceRecords/${id}`;
    try {
      await deleteDoc(doc(db, 'maintenanceRecords', id));
      setMaintenanceRecords((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addDocument = async (docData: Omit<VehicleDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = 'doc-' + Math.random().toString(36).substring(2, 9);
    const newDoc: VehicleDocument = {
      ...docData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const path = `vehicleDocuments/${id}`;
    try {
      await setDoc(doc(db, 'vehicleDocuments', id), newDoc);
      setDocuments((prev) => [newDoc, ...prev]);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      return id;
    }
  };

  const updateDocument = async (id: string, updates: Partial<VehicleDocument>): Promise<void> => {
    const path = `vehicleDocuments/${id}`;
    try {
      await updateDoc(doc(db, 'vehicleDocuments', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    const path = `vehicleDocuments/${id}`;
    try {
      await deleteDoc(doc(db, 'vehicleDocuments', id));
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createBooking = async (
    bookingData: Omit<ServiceBooking, 'id' | 'bookingRef' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> => {
    const id = 'bk-' + Math.random().toString(36).substring(2, 9);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `WOP-BK-${new Date().getFullYear()}-${randomDigits}`;

    const newBooking: ServiceBooking = {
      ...bookingData,
      id,
      bookingRef,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const path = `bookings/${id}`;
    try {
      await setDoc(doc(db, 'bookings', id), newBooking);
      setBookings((prev) => [newBooking, ...prev]);
      return bookingRef;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      return bookingRef;
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus, providerNotes?: string): Promise<void> => {
    const path = `bookings/${id}`;
    try {
      const updates: any = {
        status,
        updatedAt: new Date().toISOString(),
      };
      if (providerNotes !== undefined) updates.providerNotes = providerNotes;

      await updateDoc(doc(db, 'bookings', id), updates);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const cancelBooking = async (id: string): Promise<void> => {
    await updateBookingStatus(id, 'cancelled');
  };

  const createPickupDrop = async (
    reqData: Omit<PickupDropRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const id = 'pd-' + Math.random().toString(36).substring(2, 9);
    const newReq: PickupDropRequest = {
      ...reqData,
      id,
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPickupDropRequests((prev) => [newReq, ...prev]);
    return id;
  };

  const updatePickupDropStatus = async (
    id: string,
    status: PickupDropStatus,
    driverInfo?: { driverName?: string; driverPhone?: string }
  ): Promise<void> => {
    setPickupDropRequests((prev) =>
      prev.map((pd) =>
        pd.id === id
          ? {
              ...pd,
              status,
              ...(driverInfo?.driverName ? { driverName: driverInfo.driverName } : {}),
              ...(driverInfo?.driverPhone ? { driverPhone: driverInfo.driverPhone } : {}),
              updatedAt: new Date().toISOString(),
            }
          : pd
      )
    );
  };

  const createEmergencyRequest = async (
    sosData: Omit<EmergencyRequest, 'id' | 'sosRef' | 'status' | 'createdAt'>
  ): Promise<string> => {
    const id = 'sos-' + Math.random().toString(36).substring(2, 9);
    const sosRef = `WOP-SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSos: EmergencyRequest = {
      ...sosData,
      id,
      sosRef,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };

    const path = `emergencyRequests/${id}`;
    try {
      await setDoc(doc(db, 'emergencyRequests', id), newSos);
      setEmergencyRequests((prev) => [newSos, ...prev]);
      return sosRef;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      return sosRef;
    }
  };

  const updateEmergencyStatus = async (
    id: string,
    status: EmergencyStatus,
    assignedInfo?: { providerId?: string; providerName?: string; providerPhone?: string; etaMin?: number }
  ): Promise<void> => {
    const path = `emergencyRequests/${id}`;
    try {
      const updates: any = {
        status,
        ...(assignedInfo?.providerId ? { assignedProviderId: assignedInfo.providerId } : {}),
        ...(assignedInfo?.providerName ? { assignedProviderName: assignedInfo.providerName } : {}),
        ...(assignedInfo?.providerPhone ? { assignedProviderPhone: assignedInfo.providerPhone } : {}),
        ...(assignedInfo?.etaMin ? { estimatedArrivalMinutes: assignedInfo.etaMin } : {}),
        ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
      };

      await updateDoc(doc(db, 'emergencyRequests', id), updates);
      setEmergencyRequests((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const submitPartEnquiry = async (
    enquiryData: Omit<PartEnquiry, 'id' | 'status' | 'createdAt'>
  ): Promise<string> => {
    const id = 'enq-' + Math.random().toString(36).substring(2, 9);
    const newEnq: PartEnquiry = {
      ...enquiryData,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setPartEnquiries((prev) => [newEnq, ...prev]);
    return id;
  };

  const toggleSavePart = (partId: string) => {
    setSavedPartIds((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const updateProviderProfile = async (providerId: string, updates: Partial<ServiceProvider>): Promise<void> => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, ...updates } : p))
    );
  };

  const approveProviderApplication = async (applicantUid: string, businessName: string): Promise<void> => {
    const newProvider: ServiceProvider = {
      id: 'prov-' + Math.random().toString(36).substring(2, 8),
      userId: applicantUid,
      businessName,
      providerType: 'workshop',
      contactPhone: '+977 9840000000',
      email: `${applicantUid}@workshop.np`,
      city: 'Kathmandu',
      address: 'Kathmandu Valley',
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      isOpenNow: true,
      operatingHours: '09:00 AM - 06:00 PM',
      supportedServices: ['general_servicing', 'oil_change', 'brake_service'],
      supportedVehicleTypes: ['car', 'motorcycle'],
      pickupDropAvailable: true,
      baseInspectionFeeNpr: 500,
      description: 'Approved official service workshop on WheelOnPalm.',
    };

    setProviders((prev) => [...prev, newProvider]);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      actorUid: user?.uid || 'admin',
      actorEmail: user?.email || 'admin@wheelonpalm.np',
      action: 'APPROVE_PROVIDER_ACCOUNT',
      targetCollection: 'serviceProviders',
      targetId: newProvider.id,
      timestamp: new Date().toISOString(),
      details: `Approved application for ${businessName} (Applicant UID: ${applicantUid})`,
    };

    const path = `auditLogs/${newLog.id}`;
    try {
      await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const rejectProviderApplication = async (applicantUid: string, reason: string): Promise<void> => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      actorUid: user?.uid || 'admin',
      actorEmail: user?.email || 'admin@wheelonpalm.np',
      action: 'REJECT_PROVIDER_ACCOUNT',
      targetCollection: 'users',
      targetId: applicantUid,
      timestamp: new Date().toISOString(),
      details: `Rejected provider application: ${reason}`,
    };

    const path = `auditLogs/${newLog.id}`;
    try {
      await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // MARKETPLACE MUTATIONS
  const createMarketplaceListing = async (
    listingData: Omit<VehicleMarketplaceListing, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> => {
    const id = 'mkt-' + Math.random().toString(36).substring(2, 9);
    const newListing: VehicleMarketplaceListing = {
      ...listingData,
      id,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const path = `marketplaceListings/${id}`;
    try {
      await setDoc(doc(db, 'marketplaceListings', id), newListing);
      setMarketplaceListings((prev) => [newListing, ...prev]);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      setMarketplaceListings((prev) => [newListing, ...prev]);
      return id;
    }
  };

  const updateMarketplaceListing = async (
    id: string,
    updates: Partial<VehicleMarketplaceListing>
  ): Promise<void> => {
    const path = `marketplaceListings/${id}`;
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'marketplaceListings', id), payload);
      setMarketplaceListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
      setMarketplaceListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );
    }
  };

  const deleteMarketplaceListing = async (id: string): Promise<void> => {
    const path = `marketplaceListings/${id}`;
    try {
      await deleteDoc(doc(db, 'marketplaceListings', id));
      setMarketplaceListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
      setMarketplaceListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const markListingStatus = async (
    id: string,
    status: MarketplaceListingStatus
  ): Promise<void> => {
    await updateMarketplaceListing(id, { status });
  };

  // E-COMMERCE PARTS CART & ORDERS MUTATIONS
  const addToCart = (part: SparePart, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { part, quantity }];
    });
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const updateCartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.part.id === partId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createPartsOrder = async (
    orderData: Omit<PartsOrder, 'id' | 'orderRef' | 'createdAt' | 'status'>
  ): Promise<string> => {
    const id = 'ord-' + Math.random().toString(36).substring(2, 9);
    const orderRef = 'WOP-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: PartsOrder = {
      ...orderData,
      id,
      orderRef,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    const path = `partsOrders/${id}`;
    try {
      await setDoc(doc(db, 'partsOrders', id), newOrder);
      setPartsOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return orderRef;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      setPartsOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return orderRef;
    }
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        userVehicles,
        maintenanceRecords,
        documents,
        bookings,
        userBookings,
        pickupDropRequests,
        emergencyRequests,
        userEmergencyRequests,
        providers,
        spareParts,
        partEnquiries,
        auditLogs,
        savedPartIds,
        marketplaceListings,
        userMarketplaceListings,
        createMarketplaceListing,
        updateMarketplaceListing,
        deleteMarketplaceListing,
        markListingStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        partsOrders,
        userPartsOrders,
        createPartsOrder,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addMaintenanceRecord,
        deleteMaintenanceRecord,
        addDocument,
        updateDocument,
        deleteDocument,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        createPickupDrop,
        updatePickupDropStatus,
        createEmergencyRequest,
        updateEmergencyStatus,
        submitPartEnquiry,
        toggleSavePart,
        updateProviderProfile,
        approveProviderApplication,
        rejectProviderApplication,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
