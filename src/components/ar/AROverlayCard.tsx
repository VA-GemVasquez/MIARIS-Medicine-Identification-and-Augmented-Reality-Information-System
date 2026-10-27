import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type { Medicine } from '../../types/medicine';

interface AROverlayCardProps {
  medicine: Medicine;
  onDismiss: () => void;
}

/**
 * AROverlayCard — Concise medicine info card shown over the camera view
 * when a registered target is successfully detected.
 *
 * Deliberately kept short so it is readable on phone screens.
 */
export const AROverlayCard: React.FC<AROverlayCardProps> = ({ medicine, onDismiss }) => {
  // Take only the first indication for brevity
  const shortUse = medicine.uses[0] ?? medicine.indications?.[0] ?? 'See full monograph for uses.';
  // First precaution / warning
  const safetyNote = medicine.precautions[0] ?? medicine.warnings?.[0] ?? '';

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-3 sm:p-4 w-full max-w-sm max-h-[75vh] overflow-y-auto text-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {medicine.name}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 bg-blue-100 text-[#2563EB] rounded-md shrink-0">
              {medicine.strength}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
            {medicine.genericName} • {medicine.dosageForm}
          </p>
        </div>

        {/* Target recognized badge */}
        <div className="shrink-0 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-teal-50 border border-teal-200 text-[9px] sm:text-[10px] font-bold text-[#0D9488]">
          <Sparkles className="w-3 h-3" />
          Target Matched
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
        {/* General Use */}
        <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-blue-50 rounded-xl border border-blue-100">
          <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-700">Primary Use: </span>
            <span className="text-slate-600">{shortUse}</span>
          </div>
        </div>

        {/* Safety Warning */}
        {safetyNote && (
          <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-amber-50 rounded-xl border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-amber-900 leading-relaxed line-clamp-2 text-[10px] sm:text-xs">
              {safetyNote}
            </p>
          </div>
        )}

        {/* Rx badge if prescription-only */}
        {medicine.requiresPrescription && (
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 px-2 sm:px-2.5 py-1 rounded-lg border border-amber-200">
            <ShieldAlert className="w-3 h-3 shrink-0" />
            Prescription Required
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 sm:mt-2 leading-relaxed">
        Recognition identifies the registered package image only. It does not verify medicine
        authenticity, contents, or safety.
      </p>

      {/* Actions */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={onDismiss}
          className="text-[10px] sm:text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Dismiss
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to={`/reminders?medId=${medicine.id}`}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
          >
            + Reminder
          </Link>
          <Link
            to={`/library/${medicine.id}`}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
          >
            Full Info
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
