/**
 * Formatting and helper utilities for WheelOnPalm (Nepal localization)
 */

export function formatNpr(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'NPR 0';
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function formatNepaliDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatNepaliDateTime(isoString: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Mask sensitive chassis and engine numbers for privacy in general display.
 * e.g. "MA3EYD21S00123456" -> "MA3E••••••••3456"
 */
export function maskSensitiveId(val?: string): string {
  if (!val) return '—';
  const str = val.trim();
  if (str.length <= 6) return '••••••';
  const start = str.slice(0, 3);
  const end = str.slice(-4);
  return `${start}${'•'.repeat(Math.max(4, str.length - 7))}${end}`;
}

export interface ExpiryCalculation {
  daysRemaining: number;
  status: 'expired' | 'critical' | 'warning' | 'valid';
  label: string;
  badgeClass: string;
}

export function calculateExpiryStatus(expiryDateIso: string): ExpiryCalculation {
  if (!expiryDateIso) {
    return {
      daysRemaining: 999,
      status: 'valid',
      label: 'No Expiry',
      badgeClass: 'text-slate-600',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateIso);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      daysRemaining: diffDays,
      status: 'expired',
      label: `Expired ${Math.abs(diffDays)}d ago`,
      badgeClass: 'text-red-700 font-semibold',
    };
  } else if (diffDays <= 7) {
    return {
      daysRemaining: diffDays,
      status: 'critical',
      label: `Expiring in ${diffDays}d!`,
      badgeClass: 'text-amber-700 font-semibold',
    };
  } else if (diffDays <= 30) {
    return {
      daysRemaining: diffDays,
      status: 'warning',
      label: `Expiring in ${diffDays}d`,
      badgeClass: 'text-amber-600',
    };
  } else {
    return {
      daysRemaining: diffDays,
      status: 'valid',
      label: `${diffDays} days left`,
      badgeClass: 'text-emerald-700',
    };
  }
}

export const NEPAL_EMERGENCY_CONTACTS = [
  { name: 'Traffic Police Control', number: '103', desc: 'Accidents, road congestion, Kathmandu traffic' },
  { name: 'Nepal Police Emergency', number: '100', desc: 'General criminal, emergency & distress' },
  { name: 'Ambulance Service', number: '102', desc: 'Red Cross / Nepal Emergency Medical response' },
  { name: 'Fire Brigade', number: '101', desc: 'Vehicle fire / hazardous accidents' },
];

export const SERVICE_CATEGORIES = [
  { id: 'general_servicing', label: 'Periodic General Servicing', icon: 'Wrench', estMinNpr: 1800 },
  { id: 'oil_change', label: 'Engine Oil & Filter Change', icon: 'Droplets', estMinNpr: 2200 },
  { id: 'brake_service', label: 'Brake Inspection & Pad Replacement', icon: 'ShieldAlert', estMinNpr: 1500 },
  { id: 'tire_service', label: 'Tire Alignment, Balancing & Replacement', icon: 'Disc', estMinNpr: 1200 },
  { id: 'battery_service', label: 'Battery Health Check & Replacement', icon: 'Zap', estMinNpr: 800 },
  { id: 'ev_diagnostics', label: 'EV High-Voltage & Battery Health Diagnostics', icon: 'BatteryCharging', estMinNpr: 3000 },
  { id: 'ac_repair', label: 'Car AC Cooling Gas & Filter Service', icon: 'Wind', estMinNpr: 2500 },
  { id: 'electrical_repair', label: 'Auto Electrical & Alternator Repair', icon: 'Cpu', estMinNpr: 1600 },
  { id: 'suspension', label: 'Suspension & Shock Absorber Tuning', icon: 'Maximize2', estMinNpr: 3500 },
  { id: 'bodywork', label: 'Denting, Painting & Exterior Detailing', icon: 'Sparkles', estMinNpr: 4500 },
  { id: 'engine_repair', label: 'Engine Overhaul & Compression Tuning', icon: 'Cog', estMinNpr: 6000 },
  { id: 'other', label: 'Custom Mechanical Inspection', icon: 'Sliders', estMinNpr: 1000 },
] as const;
