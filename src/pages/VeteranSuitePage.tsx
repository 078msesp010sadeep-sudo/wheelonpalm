import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HimalayanDutySimulator } from '../components/veteran/HimalayanDutySimulator';
import { ProvenanceCertifier } from '../components/veteran/ProvenanceCertifier';
import { GhatPassChecklist } from '../components/veteran/GhatPassChecklist';
import { UstadScamDetector } from '../components/veteran/UstadScamDetector';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { 
  Award, 
  Mountain, 
  ShieldCheck, 
  CheckSquare, 
  Car, 
  Sparkles,
  Compass,
  ShieldAlert
} from 'lucide-react';

export const VeteranSuitePage: React.FC = () => {
  const { userVehicles, maintenanceRecords, documents, providers, createBooking } = useData();

  const [activeTab, setActiveTab] = useState<'scam_detector' | 'duty' | 'provenance' | 'checklist'>('scam_detector');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    userVehicles[0]?.id || ''
  );
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const activeVehicle = userVehicles.find((v) => v.id === selectedVehicleId) || userVehicles[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>50-Year Master Automotive Entrepreneur Suite</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                उस्तादजी (Ustad-Ji) Vehicle Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Battle-tested mechanical diagnostics and financial provenance honed through five decades of Nepal dealership, mountain highway fleet management, and workshop leadership.
              </p>
            </div>

            {/* Vehicle Switcher Pill */}
            {userVehicles.length > 0 && (
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                  Audited Vehicle:
                </span>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {userVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Suite Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('scam_detector')}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'scam_detector'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Scam & Mechanical Health Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('duty')}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'duty'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>Himalayan Terrain Wear Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('provenance')}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'provenance'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Resale Provenance & Valuation Certificate</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'checklist'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mountain Pass (Ghat) Pre-Trip Checklist</span>
            </button>
          </div>
        </div>

        {/* Tab Content Render */}
        {activeTab === 'scam_detector' && (
          <UstadScamDetector vehicle={activeVehicle} />
        )}

        {activeTab === 'duty' && activeVehicle && (
          <HimalayanDutySimulator
            vehicle={activeVehicle}
            onBookService={() => setIsBookingOpen(true)}
          />
        )}

        {activeTab === 'provenance' && activeVehicle && (
          <ProvenanceCertifier
            vehicle={activeVehicle}
            records={maintenanceRecords}
            documents={documents}
          />
        )}

        {activeTab === 'checklist' && (
          <GhatPassChecklist />
        )}
      </main>

      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicles={userVehicles}
        providers={providers}
        defaultVehicleId={activeVehicle?.id}
        onSubmitBooking={createBooking}
      />
    </div>
  );
};
