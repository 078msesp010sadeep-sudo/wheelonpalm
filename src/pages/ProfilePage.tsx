import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Wrench
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfileData, requestProviderRole, sendVerificationEmail, deleteAccount } = useAuth();
  const { userVehicles, maintenanceRecords, documents } = useData();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [city, setCity] = useState(user?.city || 'Kathmandu');
  const [address, setAddress] = useState(user?.address || '');
  
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Provider Application state
  const [providerBusinessName, setProviderBusinessName] = useState('');
  const [providerRoleType, setProviderRoleType] = useState<'workshop' | 'roadside'>('workshop');
  const [providerApplied, setProviderApplied] = useState(user?.providerApplicationStatus === 'pending');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileData({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        city: city.trim(),
        address: address.trim(),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerBusinessName.trim()) return;
    await requestProviderRole(providerBusinessName.trim(), providerRoleType);
    setProviderApplied(true);
  };

  const handleExportData = () => {
    const backupData = {
      userProfile: user,
      vehicles: userVehicles,
      maintenanceRecords,
      documents,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wheelonpalm_data_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your WheelOnPalm account and all associated vehicles? This cannot be undone.')) {
      await deleteAccount();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Account Settings & Driver Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal contact info, Nepal transport details, and provider status.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-base flex items-center justify-center">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{user?.fullName}</h3>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 uppercase tracking-wider block">
                {user?.role}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {user?.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {isSaved && (
              <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile information saved successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nepal Contact Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City / District
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Other">Other District</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street / Area Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Baneshwor, Kathmandu"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Workshop Provider Onboarding Request Box */}
        {user?.role === 'customer' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Are you an Auto Workshop or Roadside Recovery Provider?
                </h3>
                <p className="text-xs text-slate-500">
                  Apply to list your diagnostic bays or emergency towing patrols on WheelOnPalm Nepal.
                </p>
              </div>
            </div>

            {user?.providerApplicationStatus === 'pending' || providerApplied ? (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
                <span className="font-bold block">Application Submitted for Administrative Review</span>
                <p>
                  Your provider request for <strong>{user?.providerBusinessName || providerBusinessName}</strong> has been forwarded to the WheelOnPalm platform admin. Once authorized, you will gain access to the Workshop Provider Portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProviderApplication} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Business / Workshop Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Balaju Multi-Brand Auto Service"
                      value={providerBusinessName}
                      onChange={(e) => setProviderBusinessName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Provider Category *
                    </label>
                    <select
                      value={providerRoleType}
                      onChange={(e) => setProviderRoleType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="workshop">Authorized Auto Workshop</option>
                      <option value="roadside">Roadside Towing & Rescue Patrol</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Submit Provider Application
                </button>
              </form>
            )}
          </div>
        )}

        {/* Data Privacy & Export / Account Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Data Management & Privacy</h3>
          <p className="text-xs text-slate-500">
            Export a full JSON backup of your vehicle records, or request complete account erasure.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download My Vehicle Data (JSON)</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Delete Account & Data</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
