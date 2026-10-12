import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, FileText, Lock } from 'lucide-react';

export const TermsPrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to WheelOnPalm</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Terms of Service & Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Legal framework for automotive services, bluebook document storage, and roadside assistance in Nepal.
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                1. Product Vision & Scope
              </h2>
              <p>
                WheelOnPalm operates as a digital vehicle management and matchmaking platform within the territory of Nepal. It facilitates connections between vehicle owners, accredited automotive workshops, independent spare-parts suppliers, and roadside recovery operators.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                2. Bluebook & Document Security
              </h2>
              <p>
                Personal vehicle documents, including Savari Darta Pramanpatra (Bluebook), Sawari Kar (Vehicle Tax) receipts, and Motor Insurance policies, are stored strictly within user-isolated vaults. Sensitive identifiers such as Chassis and Engine serial numbers are masked by default across all general views to safeguard user privacy against unauthorized scraping.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                3. Emergency Assistance Protocol
              </h2>
              <p>
                The Emergency Roadside SOS feature alerts nearby registered rescue patrols and tow trucks. It is <strong>not</strong> an emergency rescue service for personal injury or crime. In the event of highway accidents, physical injuries, or hazardous conditions, users are required to contact the Nepal Traffic Police (103) or Nepal Police (100) directly.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                4. Pricing & Currency
              </h2>
              <p>
                All pricing quotes, initial estimates, and parts listings are displayed in Nepalese Rupees (NPR). Estimates provided during service scheduling are subject to physical workshop inspection. Parts warranties are held directly by verified OEM distributors.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                5. Account Erasure & Data Portability
              </h2>
              <p>
                Users maintain full ownership of their data and can export their vehicle records in JSON format at any time from their profile settings, or request permanent deletion of their account and associated documents.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
