import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { formatNpr } from '../../lib/formatters';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Search, 
  Gauge, 
  Flame, 
  Wrench, 
  DollarSign, 
  Sparkles,
  FileText,
  Award
} from 'lucide-react';

interface UstadScamDetectorProps {
  vehicle?: Vehicle;
}

interface InspectionItem {
  id: string;
  category: string;
  title: string;
  mechanicSecret: string;
  howToTest: string;
  criticality: 'high' | 'critical' | 'medium';
}

const USTAD_CHECKLIST_ITEMS: InspectionItem[] = [
  {
    id: 'c1',
    category: 'Engine & Combustion Health',
    title: 'Hot Oil Filler Cap Pressure & Blowby Test',
    mechanicSecret: 'Worn piston rings leak combustion gases into the crankcase. Dishonest sellers mask this with high-viscosity 20W-50 oil.',
    howToTest: 'Start the engine until warm. Unscrew the engine oil cap and place it upside down over the opening. If it dances or blows off violently with blue/white smoke, the engine needs an overhaul (NPR 25,000–80,000).',
    criticality: 'critical',
  },
  {
    id: 'c2',
    category: 'Chassis & Accident History',
    title: 'Subframe & Steering Stem Weld Seam Inspection',
    mechanicSecret: 'Motorcycles repaired after head-on collisions on BP Highway or Prithvi Highway often have repainted neck welds.',
    howToTest: 'Turn the handlebar full lock left and right. Inspect behind the headlight bracket and fork cone bearings with a flashlight. Look for uneven bead welds, mismatched paint overspray, or hairline stress cracks.',
    criticality: 'critical',
  },
  {
    id: 'c3',
    category: 'Odometer & Meter Tampering',
    title: 'Pedal Rubber & Footpeg Wear vs. Displayed Odometer',
    mechanicSecret: 'In Nepal second-hand markets, digital odometers are routinely rewound from 60,000 km back to 18,000 km.',
    howToTest: 'Check the rubber treads on the brake pedal, gear shift lever, and hand grips. If the meter shows 15,000 km but pedal rubbers are worn down to bare metal, the meter has been rolled back.',
    criticality: 'high',
  },
  {
    id: 'c4',
    category: 'Transmission & Clutch',
    title: 'High-Gear Low-Speed Stall & Slip Test',
    mechanicSecret: 'Worn clutch plates slip when climbing Nagdhunga or Chandragiri ghats, causing high fuel consumption and heat.',
    howToTest: 'Engage 3rd gear at a standstill with the front brake held firmly. Release the clutch steadily. If the engine doesn’t stall immediately and revs up without moving, clutch plates are burnt (NPR 4,000–12,000).',
    criticality: 'high',
  },
  {
    id: 'c5',
    category: 'Nepal Transport Legal & Tax',
    title: 'Bluebook Engine & Chassis Stamp Matching',
    mechanicSecret: 'Stolen or assembled bikes often feature hand-punched counterfeit numbers that differ from DOTM (Yatayat) server records.',
    howToTest: 'Compare the embossed metal stamping on the engine casing and steering neck with page 2 of the Bluebook. Every single alphanumeric digit, prefix, and dot must be laser-straight with factory font.',
    criticality: 'critical',
  },
  {
    id: 'c6',
    category: 'Suspension & Highway Rutting',
    title: 'Fork Seal Oil Leak & Stanchion Rust Pitting',
    mechanicSecret: 'Nepal road dust destroys inverted (USD) forks. Blown seals spray oil onto brake pads, causing total brake failure.',
    howToTest: 'Wipe the front shock absorber chrome tubes with a clean white tissue. Compress the front suspension hard 5 times. If you see oil rings or rust pits on the stanchion, forks need immediate rebuild (NPR 3,500–9,000).',
    criticality: 'medium',
  },
  {
    id: 'c7',
    category: 'Electrical & Stator Coil',
    title: 'Idle Charging Voltage & Battery Load Drop',
    mechanicSecret: 'Weak stator coils fail to recharge the battery when headlights and horn are used on cold winter Kathmandu mornings.',
    howToTest: 'Turn on the high-beam headlight and blow the horn with the engine at idle. If the instrument cluster dims significantly or the horn sounds feeble, the magnet coil or rectifier is dying.',
    criticality: 'medium',
  },
];

export const UstadScamDetector: React.FC<UstadScamDetectorProps> = ({ vehicle }) => {
  const [checkedStatus, setCheckedStatus] = useState<Record<string, 'pass' | 'fail' | 'warn'>>({});
  const [taxUnpaidYears, setTaxUnpaidYears] = useState<number>(0);
  const [annualTaxRate, setAnnualTaxRate] = useState<number>(5500); // 150cc-250cc bike tax

  const handleStatus = (id: string, status: 'pass' | 'fail' | 'warn') => {
    setCheckedStatus((prev) => ({ ...prev, [id]: status }));
  };

  const totalChecks = USTAD_CHECKLIST_ITEMS.length;
  const passedCount = Object.values(checkedStatus).filter((s) => s === 'pass').length;
  const failedCount = Object.values(checkedStatus).filter((s) => s === 'fail').length;
  const warningCount = Object.values(checkedStatus).filter((s) => s === 'warn').length;

  // Nepal Transport Tax Backlog Penalty Calculator
  // In Nepal, overdue tax attracts 5% in first 30 days, up to 20% in first year, and compounding penalty thereafter!
  const principalTax = taxUnpaidYears * annualTaxRate;
  const penaltyAmount = taxUnpaidYears > 0 ? Math.round(principalTax * 0.32) : 0;
  const totalTaxBacklog = principalTax + penaltyAmount;

  // Ustad's overall trust score
  const scorePercent = Math.round((passedCount / totalChecks) * 100);

  let verdict = {
    title: 'Inspection in Progress',
    color: 'text-slate-800 bg-slate-100 border-slate-200',
    advice: 'Run through the tests standing next to the vehicle before negotiating.',
  };

  if (failedCount >= 2) {
    verdict = {
      title: '🚨 WALK AWAY — Severe Mechanical or Legal Red Flags',
      color: 'text-red-800 bg-red-50 border-red-300',
      advice: 'The vehicle exhibits major structural, engine blowby, or documentation issues that will cost tens of thousands in repairs. Do not purchase.',
    };
  } else if (failedCount === 1 || warningCount >= 2) {
    verdict = {
      title: '⚠️ NEGOTIATE HEAVILY — High Repair Expenses Ahead',
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      advice: `Deduct at least NPR ${((failedCount * 25000) + (warningCount * 8000)).toLocaleString()} from the seller's asking price to cover immediate workshop rebuilds and tax backlogs.`,
    };
  } else if (passedCount >= 5 && failedCount === 0) {
    verdict = {
      title: '✅ USTAD APPROVED — Clean Mechanical Provenance',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      advice: 'Vehicle demonstrates authentic condition, healthy compression, straight chassis welds, and matched documentation. Fair buy at current Nepal market rates.',
    };
  }

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>50-Year Automotive Veteran Diagnostic Lab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              उस्तादजी (Ustad-Ji) Vehicle Scam & Mechanical Health Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real workshop secrets learned over 50 years of buying, repairing, and selling thousands of vehicles across Nepal. Prevent buying flood-damaged, meter-tampered, or cracked-chassis bikes.
            </p>
          </div>

          {/* Quick Score Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shrink-0 min-w-[160px]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Audit Progress
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {passedCount + failedCount + warningCount} / {totalChecks}
            </div>
            <span className="text-xs font-bold text-teal-700">
              {scorePercent}% Passed
            </span>
          </div>
        </div>

        {/* Dynamic Verdict Box */}
        <div className={`p-4 rounded-2xl border transition-all ${verdict.color}`}>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">{verdict.title}</h4>
              <p className="text-xs mt-1 leading-relaxed">{verdict.advice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nepal Tax Backlog Penalty Calculator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              नेपाल सवारी कर तथा जरिवाना हिसाब (Nepal Tax & Penalty Calculator)
            </h3>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
            DOTM Bagmati / Gandaki Slabs
          </span>
        </div>

        <p className="text-xs text-slate-500">
          In Nepal, sellers frequently hide 2 to 4 years of unpaid annual road tax. The Department of Transport charges heavy 32% compounding fines on overdue taxes!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Unpaid Tax Backlog Years:
            </label>
            <select
              value={taxUnpaidYears}
              onChange={(e) => setTaxUnpaidYears(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
            >
              <option value="0">0 Years (Tax is 100% Up to Date)</option>
              <option value="1">1 Year Overdue (Past Ashad 2081)</option>
              <option value="2">2 Years Overdue (2080-2082)</option>
              <option value="3">3 Years Overdue (2079-2082)</option>
              <option value="4">4 Years Overdue</option>
              <option value="5">5+ Years Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Engine CC Tax Bracket (Annual):
            </label>
            <select
              value={annualTaxRate}
              onChange={(e) => setAnnualTaxRate(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="3500">Up to 125cc (NPR 3,500/yr)</option>
              <option value="5500">126cc to 250cc (NPR 5,500/yr)</option>
              <option value="7500">251cc to 400cc / Himalayan (NPR 7,500/yr)</option>
              <option value="22000">Car up to 1500cc (NPR 22,000/yr)</option>
              <option value="35000">SUV 1501cc to 2500cc (NPR 35,000/yr)</option>
            </select>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              Total Clearance Cost (Tax + Fines)
            </span>
            <div className="text-xl font-extrabold text-amber-400 tabular-nums">
              {formatNpr(totalTaxBacklog)}
            </div>
            <span className="text-[10px] text-slate-300">
              {taxUnpaidYears === 0 ? 'Clear to transfer' : `Includes ~${formatNpr(penaltyAmount)} late penalties`}
            </span>
          </div>
        </div>
      </div>

      {/* 50-Point Practical Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Interactive On-Site Mechanical Checklist
          </h3>
          <span className="text-xs text-slate-500">
            Click Pass, Warn, or Fail based on your physical test:
          </span>
        </div>

        <div className="space-y-4">
          {USTAD_CHECKLIST_ITEMS.map((item, idx) => {
            const status = checkedStatus[item.id];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleStatus(item.id, 'pass')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        status === 'pass'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>

                    <button
                      onClick={() => handleStatus(item.id, 'warn')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        status === 'warn'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Warning</span>
                    </button>

                    <button
                      onClick={() => handleStatus(item.id, 'fail')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        status === 'fail'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Fail</span>
                    </button>
                  </div>
                </div>

                {/* Secret & Test Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-amber-950">
                    <strong className="block text-[11px] text-amber-900 mb-0.5 font-bold">
                      💡 50-Year Entrepreneur Inside Secret:
                    </strong>
                    <p className="leading-relaxed text-[11px]">{item.mechanicSecret}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700">
                    <strong className="block text-[11px] text-slate-900 mb-0.5 font-bold">
                      🔧 How to Perform the Test:
                    </strong>
                    <p className="leading-relaxed text-[11px]">{item.howToTest}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
