import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Shield, CheckSquare, Square, Info } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  system: string;
  veteranTip: string;
  criticalSeverity: boolean;
}

const GHAT_PASS_CHECKS: ChecklistItem[] = [
  {
    id: 'brake_fluid',
    title: 'Brake Fluid Reservoir & Color Inspection',
    system: 'Hydraulic Braking',
    veteranTip: 'Fluid should be transparent amber, never dark brown or black. If the level is near MIN, do not just top up—your brake pads are likely worn down.',
    criticalSeverity: true,
  },
  {
    id: 'spare_tire',
    title: 'Spare Wheel (Stepney) Pressure & Lug Wrench Fitment',
    system: 'Tires & Wheels',
    veteranTip: 'In 8 out of 10 roadside rescues on Mugling, the spare wheel was completely flat inside the trunk! Inflate spare wheel to +3 PSI above standard spec.',
    criticalSeverity: true,
  },
  {
    id: 'coolant_level',
    title: 'Coolant Level & Radiator Cap Seal Check',
    system: 'Thermal Cooling',
    veteranTip: 'Never open when hot! Inspect the rubber gasket under the radiator cap. A brittle gasket causes boiling coolant blowout on uphill Nagdhunga jams.',
    criticalSeverity: true,
  },
  {
    id: 'belt_tension',
    title: 'Alternator & Water Pump Drive Belt Check',
    system: 'Engine Ancillaries',
    veteranTip: 'Press with your thumb midway between pulleys. Deflection should be 8-10mm. If the ribs show micro-cracks, replace before crossing hills.',
    criticalSeverity: false,
  },
  {
    id: 'jack_tools',
    title: 'Jack Operation & Vehicle Jacking Point Cleanliness',
    system: 'Emergency Gear',
    veteranTip: 'Test wind the mechanical scissor jack once at home. Grease the lead screw so it does not seize under vehicle load on muddy roadside gravel.',
    criticalSeverity: false,
  },
  {
    id: 'wiper_wash',
    title: 'Windshield Wiper Blades & Washer Fluid with Soap',
    system: 'Visibility',
    veteranTip: 'Monsoon trucks on Prithvi Highway throw muddy river slurry onto your glass. Regular water only smears; use proper windshield washer soap.',
    criticalSeverity: false,
  },
  {
    id: 'lights_hazard',
    title: 'Hazard Flashers & High/Low Beam Fog Penetration',
    system: 'Electrical',
    veteranTip: 'In heavy mountain fog at Daman or Chandragiri, high beams reflect back into your eyes. Ensure your yellow/low-beam lamps are properly aligned.',
    criticalSeverity: true,
  },
  {
    id: 'bluebook_hardcopy',
    title: 'Physical Bluebook & Tax Receipt in Glovebox',
    system: 'DOTM Compliance',
    veteranTip: 'Traffic police checkpoints at Nagdhunga and Mugling will impound keys if the annual tax sticker has lapsed past the 3-month grace window.',
    criticalSeverity: true,
  },
];

export const GhatPassChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([
    'bluebook_hardcopy',
    'lights_hazard',
  ]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const completedCount = checkedIds.length;
  const totalCount = GHAT_PASS_CHECKS.length;
  const isReady = completedCount === totalCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
              Prithvi & B.P. Highway Safety
            </span>
            <span className="text-xs text-slate-400">· Pre-Trip Protocol</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Mountain Pass (Ghat) Pre-Trip Safety Audit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            50 years of mountain vehicle recovery condensed into 8 mandatory checks before leaving the Kathmandu Valley.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-400 block">Checklist Readiness</span>
          <span className={`text-2xl font-black tabular-nums font-mono ${
            isReady ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isReady ? 'bg-emerald-500' : 'bg-teal-500'
            }`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>{completedCount} of {totalCount} safety checks verified</span>
          <span className="font-semibold text-slate-700">
            {isReady ? 'Ready for Mountain Ghat Crossing' : 'Incomplete Safety Protocol'}
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {GHAT_PASS_CHECKS.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? 'bg-slate-50/70 border-slate-200 text-slate-900'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isChecked ? 'text-slate-800 line-through' : 'text-slate-900'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.system}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>उस्तादजीको सल्लाह:</strong> {item.veteranTip}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Need a professional mechanic to do this inspection before you depart?</span>
        </div>
        <button
          onClick={() => alert('Opening service appointment booking wizard...')}
          className="px-3 py-1.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 whitespace-nowrap text-xs"
        >
          Book 15-Min Pre-Trip Bay Check
        </button>
      </div>
    </div>
  );
};
