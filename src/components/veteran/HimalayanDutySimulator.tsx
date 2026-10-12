import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { formatNpr } from '../../lib/formatters';
import { 
  Mountain, 
  ShieldAlert, 
  Flame, 
  Gauge, 
  Droplets, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity,
  Compass
} from 'lucide-react';

interface RouteProfile {
  id: string;
  name: string;
  elevationDeltaMeters: string;
  terrainType: string;
  harshnessMultiplier: number;
  description: string;
  primaryRisk: string;
}

const NEPAL_ROUTES: RouteProfile[] = [
  {
    id: 'kathmandu_urban',
    name: 'Kathmandu Valley Ring Road & City Core',
    elevationDeltaMeters: '1,300m - 1,400m',
    terrainType: 'Stop-and-Go Congestion / PM2.5 Dust',
    harshnessMultiplier: 1.8,
    description: 'Continuous 1st & 2nd gear idling, stop-and-go clutch feathering, and high airborne dust clogging air filters.',
    primaryRisk: 'Engine oil thermal breakdown and carbon buildup on throttle body.',
  },
  {
    id: 'prithvi_mugling',
    name: 'Prithvi Highway / Mugling Downhill Ghat',
    elevationDeltaMeters: '1,500m → 250m steep drop',
    terrainType: 'Continuous Mountain Hairpin Descent',
    harshnessMultiplier: 2.6,
    description: 'Prolonged downhill braking causing extreme friction heat in brake discs and vapor lock in humid brake fluid.',
    primaryRisk: 'Brake fluid boiling & sudden pedal fade on mountain descents.',
  },
  {
    id: 'bp_highway',
    name: 'B.P. Highway (Dhulikhel - Sindhuli - Bardibas)',
    elevationDeltaMeters: '1,600m → 100m switchbacks',
    terrainType: 'Tight Alpine Curves & Constant Shifting',
    harshnessMultiplier: 2.4,
    description: 'Over 160 continuous switchbacks requiring constant gear transitions and clutch engagement.',
    primaryRisk: 'Clutch plate overheating and transmission synchromesh wear.',
  },
  {
    id: 'mustang_offroad',
    name: 'Beni - Jomsom - Mustang Mountain Corridor',
    elevationDeltaMeters: '800m → 3,800m high-altitude',
    terrainType: 'Monsoon Boulder Bed & Unpaved River Crossings',
    harshnessMultiplier: 3.5,
    description: 'Extreme washboard gravel, deep mud, water splashes into alternator, and rocky impact fatigue.',
    primaryRisk: 'Suspension strut blowout, bent control arms, and underbody oil sump puncture.',
  },
  {
    id: 'terai_eastwest',
    name: 'Mahendra East-West Highway Long Cruise',
    elevationDeltaMeters: '80m - 150m flat plains',
    terrainType: 'High-Speed Straight Cruise & High Heat',
    harshnessMultiplier: 1.2,
    description: 'Sustained highway speeds in summer ambient temperatures exceeding 38°C in Terai plains.',
    primaryRisk: 'High-speed tire blowout from excessive highway heat and underinflation.',
  },
];

interface HimalayanDutySimulatorProps {
  vehicle: Vehicle;
  onBookService: () => void;
}

export const HimalayanDutySimulator: React.FC<HimalayanDutySimulatorProps> = ({
  vehicle,
  onBookService,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('prithvi_mugling');
  const [recentTripsCount, setRecentTripsCount] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedRoute = NEPAL_ROUTES.find((r) => r.id === selectedRouteId) || NEPAL_ROUTES[1];

  // 50-year veteran formula calculations:
  // 1 km of severe mountain descent is mechanically equivalent to ~2.5x flat km.
  const baseAgeYears = Math.max(1, new Date().getFullYear() - vehicle.manufactureYear);
  const odoThousands = vehicle.currentOdometer / 1000;

  // Fluid boiling risk: Higher on older vehicles and humid mountain descent
  const brakeFluidBoilingRisk = Math.min(
    95,
    Math.round(20 + baseAgeYears * 8 + selectedRoute.harshnessMultiplier * 14 + recentTripsCount * 4)
  );

  // Clutch & Transmission plate fatigue
  const clutchFatiguePercent = Math.min(
    92,
    Math.round(15 + (odoThousands % 40) * 1.5 + selectedRoute.harshnessMultiplier * 12)
  );

  // Oil oxidation due to dust
  const oilOxidationMultiplier = (
    1.0 + (selectedRoute.harshnessMultiplier * 0.35)
  ).toFixed(1);

  // Suspension strut fatigue
  const suspensionStressPercent = Math.min(
    98,
    Math.round(18 + (odoThousands % 50) * 1.3 + (selectedRoute.id === 'mustang_offroad' ? 45 : 15))
  );

  // Overall Himalayan Duty Score (0-100, 100 being pristine)
  const dutyHealthScore = Math.max(
    30,
    Math.round(100 - (brakeFluidBoilingRisk * 0.3 + clutchFatiguePercent * 0.3 + suspensionStressPercent * 0.4))
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
              50-Year Master Mechanic Formulation
            </span>
            <span className="text-xs text-slate-400">· Nepal Topography</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Himalayan Terrain & Duty-Cycle Stress Predictor
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard odometers only track flat distance. This simulator models thermal brake boiling, mountain clutch slip, and dust oxidation for <strong>{vehicle.make} {vehicle.model}</strong>.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-400 block">Current Duty Health</span>
          <span className={`text-2xl font-black tabular-nums font-mono ${
            dutyHealthScore >= 75 ? 'text-emerald-600' : dutyHealthScore >= 55 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {dutyHealthScore}/100
          </span>
        </div>
      </div>

      {/* Route Selector Controls */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Predominant Driving Terrain / Planned Mountain Route:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {NEPAL_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => {
                setSelectedRouteId(route.id);
                handleRunSimulation();
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                selectedRouteId === route.id
                  ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <span className="font-bold text-slate-900 block leading-snug">{route.name}</span>
                <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
                  {route.terrainType}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Elevation: {route.elevationDeltaMeters}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block italic line-clamp-2">
                {route.primaryRisk}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency Slider */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800 block">Frequency on this route (Trips / Month):</span>
          <span className="text-slate-500 text-[11px]">Calculates cumulative thermal cycling on fluids and mechanical linkages.</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="12"
            value={recentTripsCount}
            onChange={(e) => setRecentTripsCount(Number(e.target.value))}
            className="accent-teal-600 w-32 cursor-pointer"
          />
          <span className="font-bold font-mono text-slate-900 tabular-nums w-12 text-right">
            {recentTripsCount} {recentTripsCount === 1 ? 'trip' : 'trips'}
          </span>
        </div>
      </div>

      {/* Diagnostic Stress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Metric 1: Brake Fluid Boiling Risk */}
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              Brake Fluid Fade Risk
            </span>
            <span className={`text-xs font-bold tabular-nums font-mono ${
              brakeFluidBoilingRisk > 70 ? 'text-red-600' : 'text-amber-600'
            }`}>
              {brakeFluidBoilingRisk}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                brakeFluidBoilingRisk > 70 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${brakeFluidBoilingRisk}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            {brakeFluidBoilingRisk > 70
              ? 'CRITICAL: High moisture absorption. Sudden pedal sink on long downhill braking.'
              : 'Moderate risk. Flush DOT4 fluid before mountain crossing.'}
          </p>
        </div>

        {/* Metric 2: Clutch & Transmission Stress */}
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Clutch Plate Thermal Load
            </span>
            <span className={`text-xs font-bold tabular-nums font-mono ${
              clutchFatiguePercent > 75 ? 'text-red-600' : 'text-teal-700'
            }`}>
              {clutchFatiguePercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                clutchFatiguePercent > 75 ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${clutchFatiguePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            {clutchFatiguePercent > 75
              ? 'Friction lining glazing risk from frequent hill-starts on steep Nepal switchbacks.'
              : 'Clutch clearance within safe operating tolerance.'}
          </p>
        </div>

        {/* Metric 3: Oil Contamination Acceleration */}
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Oil Degradation Rate
            </span>
            <span className="text-xs font-bold tabular-nums font-mono text-purple-700">
              {oilOxidationMultiplier}x OEM
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Number(oilOxidationMultiplier) * 45)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Kathmandu PM2.5 and monsoon humidity thin synthetic oil viscosity faster than European test standards.
          </p>
        </div>

        {/* Metric 4: Suspension & Bushing Fatigue */}
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              Strut & Bushing Fatigue
            </span>
            <span className={`text-xs font-bold tabular-nums font-mono ${
              suspensionStressPercent > 70 ? 'text-red-600' : 'text-teal-700'
            }`}>
              {suspensionStressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                suspensionStressPercent > 70 ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${suspensionStressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Pothole impact frequency. Check lower arm ball joints and rubber boots for grease leaks.
          </p>
        </div>
      </div>

      {/* Veteran Entrepreneur's Advice Box */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Ustad-Ji's 50-Year Golden Rule for this Terrain
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Expert Advisory Note</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedRoute.id === 'prithvi_mugling' && (
            <>
              "Never coast downhill in neutral on the Mugling pass. Use <strong>Engine Braking in 2nd or 3rd gear</strong>. If your brake pedal feels spongy after 10 hairpins, pull over immediately at Malekhu or Kurintar and let the rotors cool for 20 minutes. Boiling brake fluid creates gas bubbles, which results in zero pedal pressure."
            </>
          )}
          {selectedRoute.id === 'kathmandu_urban' && (
            <>
              "Kathmandu traffic kills synthetic oil before 5,000 km because your engine runs for 3 hours to cover only 15 kilometers. Change your oil filter and blow clean your air filter every 4,000 km, regardless of what the dealer's 10,000 km schedule says."
            </>
          )}
          {selectedRoute.id === 'bp_highway' && (
            <>
              "On B.P. Highway switchbacks, resist resting your left foot on the clutch pedal (riding the clutch). Even slight continuous pressure heats the throwout bearing to over 140°C, causing sudden release bearing seizure."
            </>
          )}
          {selectedRoute.id === 'mustang_offroad' && (
            <>
              "Before driving Beni to Jomsom, check that your alternator belt has zero cracks, tie a tow strap to your front chassis tow hook beforehand, and install a metallic skid plate to protect the engine oil sump from boulder strikes."
            </>
          )}
          {selectedRoute.id === 'terai_eastwest' && (
            <>
              "In Terai summer heat (40°C), highway tire pressure rises by 4 to 6 PSI after 40 minutes of cruising. Never bleed air from hot tires; set your cold pressure exactly to manufacturer spec before dawn departure."
            </>
          )}
        </p>

        {vehicle.fuelType === 'electric' && (
          <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-1.5">
            <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              <strong>EV Mountain Rule:</strong> Do not charge to 100% at the top of a mountain pass (e.g. Nagarkot or Daman). If the battery is at 100%, regenerative braking is disabled by the BMS to prevent overcharge, forcing your friction brakes to absorb 100% of vehicle kinetic energy on the descent!
            </span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
          <span className="text-slate-400">Recommended Next Step:</span>
          <button
            onClick={onBookService}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
          >
            Schedule Preventive Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
