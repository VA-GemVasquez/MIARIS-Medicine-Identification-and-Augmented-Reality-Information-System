import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { medicines } from '../../data/medicines';

interface ARManualSearchProps {
  query: string;
  onChange: (q: string) => void;
}

/**
 * ARManualSearchProps — Shown in the Scanner when no target is detected.
 * Lets the user find a medicine record by name.
 */
export const ARManualSearch: React.FC<ARManualSearchProps> = ({ query, onChange }) => {
  const results = query.trim()
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.genericName.toLowerCase().includes(query.toLowerCase()) ||
          m.brandNames.some((b) => b.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type medicine name or brand (e.g. Paracetamol, Advil)..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {results.length > 0 && (
        <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
          {results.map((med) => (
            <div
              key={med.id}
              className="p-3 bg-white hover:bg-blue-50/40 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-bold text-slate-900 block">
                  {med.name} ({med.strength})
                </span>
                <span className="text-slate-500 text-[11px]">
                  {med.genericName} • {med.dosageForm}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/ar?id=${med.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-[#0D9488] font-semibold text-[11px] hover:bg-teal-100"
                >
                  <Sparkles className="w-3 h-3" />
                  AR
                </Link>
                <Link
                  to={`/library/${med.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-semibold text-[11px] hover:bg-blue-700"
                >
                  View
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-3">
          No medicines matched "<strong>{query}</strong>". Try a brand name or generic formula.
        </p>
      )}
    </div>
  );
};

