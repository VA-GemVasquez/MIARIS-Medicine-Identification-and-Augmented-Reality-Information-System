import type { MedicineCategory } from '../types/medicine';

export function getCategoryBadgeClasses(category: MedicineCategory): string {
  switch (category) {
    case 'Analgesic':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Antibiotic':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Antihistamine':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Gastrointestinal':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Cardiovascular':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'Vitamin & Supplement':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

export function truncateText(text: string, maxLength: number = 90): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generates a deterministic placeholder color pair from a medicine name.
 * Used as a CSS gradient fallback when a medicine image fails to load or is missing.
 */
export function getMedicinePlaceholderGradient(name: string): string {
  const palettes = [
    'from-blue-100 to-teal-100',
    'from-purple-100 to-pink-100',
    'from-amber-100 to-orange-100',
    'from-teal-100 to-green-100',
    'from-rose-100 to-red-100',
    'from-indigo-100 to-blue-100',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return palettes[Math.abs(hash) % palettes.length];
}
