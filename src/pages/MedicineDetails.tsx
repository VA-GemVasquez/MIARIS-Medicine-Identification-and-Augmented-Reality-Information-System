import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Layers,
  Thermometer,
  CheckCircle2,
  Building2,
  HelpCircle,
  FileText,
  Info,
  Calendar,
  Pill,
} from 'lucide-react';
import { medicines } from '../data/medicines';
import { Badge } from '../components/ui/Badge';
import { recordMedicineViewed } from '../utils/recentMedicines';
import { useAppStore } from '../store';
import { getMedicinePlaceholderGradient } from '../utils/formatters';

export const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setSelectedMedicineId = useAppStore((state) => state.setSelectedMedicineId);
  const [imgError, setImgError] = useState(false);

  const medicine = medicines.find((m) => m.id === id);

  // Sync with global store & recently viewed list on mount
  useEffect(() => {
    if (medicine) {
      setSelectedMedicineId(medicine.id);
      recordMedicineViewed(medicine.id);
    }
    return () => {
      setSelectedMedicineId(null);
    };
  }, [medicine, setSelectedMedicineId]);

  if (!medicine) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Medicine Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested medicine ID does not match any entry in the demonstration database.
        </p>
        <button
          onClick={() => navigate('/library')}
          className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Return to Medicine Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 transition-colors self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Library
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to={`/ar?id=${medicine.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-[#0D9488] hover:bg-teal-100 text-xs font-bold border border-teal-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AR View Layout
          </Link>

          <Link
            to={`/reminders?medId=${medicine.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            Add to Reminders
          </Link>
        </div>
      </div>

      {/* Demonstration Record Banner & Clinical Review Date */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Demonstration Medical Record:</strong> Compiled from verified public pharmaceutical references.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Reviewed: {medicine.lastReviewedDate}
          </span>
          <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">
            ID: {medicine.id}
          </span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Packaging Image & AR Target ID */}
          <div className={`relative h-64 md:h-auto min-h-[220px] bg-gradient-to-br ${getMedicinePlaceholderGradient(medicine.name)}`}>
            {(medicine.imagePath || medicine.imageUrl) && !imgError ? (
              <img
                src={medicine.imagePath || medicine.imageUrl}
                alt={`${medicine.name} packaging`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <Pill className="w-14 h-14 text-slate-400 opacity-50" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-semibold">No image available</span>
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <Badge variant="blue">{medicine.category}</Badge>
              {medicine.requiresPrescription ? (
                <Badge variant="warning" className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Prescription Only (Rx)
                </Badge>
              ) : (
                <Badge variant="teal">Over The Counter (OTC)</Badge>
              )}
            </div>
            {medicine.arTargetId && (
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between">
                <span className="font-semibold">AR Target Descriptor</span>
                <span className="text-teal-400 font-mono text-[10px]">
                  {medicine.arTargetId}
                </span>
              </div>
            )}
          </div>

          {/* 1. Medicine Name & Generic Name */}
          <div className="p-6 md:col-span-2 space-y-4">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {medicine.name}
                </h1>
                <span className="text-sm font-bold px-2.5 py-1 bg-blue-100 text-[#2563EB] rounded-lg shrink-0">
                  {medicine.strength}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Active Generic Molecule: <span className="font-bold text-slate-900">{medicine.genericName}</span>
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {medicine.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Dosage Form</span>
                <span className="font-bold text-slate-800">{medicine.dosageForm}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Strength</span>
                <span className="font-bold text-slate-800">{medicine.strength}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-semibold">Manufacturer</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {medicine.manufacturer}
                </span>
              </div>
            </div>

            {medicine.brandNames.length > 0 && (
              <div className="pt-2 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Commercial Brand Names:</span>
                <div className="flex flex-wrap gap-1.5">
                  {medicine.brandNames.map((brand, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Layout Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 2. Uses (Indications) */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0D9488]">
            <CheckCircle2 className="w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-900">Therapeutic Uses & Indications</h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {medicine.uses.map((use, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-1.5 shrink-0" />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Dosage Information */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">
            <Clock className="w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-900">Dosage Information & Administration</h2>
          </div>
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {medicine.dosageInfo}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Take strictly in accordance with prescription labeling or medical practitioner instructions.
          </p>
        </section>

        {/* 4. Precautions & Warnings */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-3 bg-amber-50/20">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F59E0B]">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-sm font-bold text-amber-950">Precautions & Warnings</h2>
          </div>
          <ul className="space-y-2 text-xs text-amber-950 leading-relaxed">
            {medicine.precautions.map((precaution, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                <span>{precaution}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Contraindications */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-red-200/80 shadow-xs space-y-3 bg-red-50/20">
          <div className="flex items-center gap-2 text-sm font-bold text-[#DC2626]">
            <ShieldAlert className="w-4 h-4" />
            <h2 className="text-sm font-bold text-red-950">Contraindications</h2>
          </div>
          <p className="text-xs text-red-900/80 mb-2">
            Do not administer in the presence of the following medical conditions or allergies:
          </p>
          <ul className="space-y-1.5 text-xs text-red-950 list-disc list-inside">
            {medicine.contraindications.map((contra, idx) => (
              <li key={idx}>{contra}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Side Effects and Storage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 6. Side Effects */}
        <section className="md:col-span-2 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-bold text-slate-900">Adverse Reactions & Side Effects</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clinically documented side effects associated with this medication:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {medicine.sideEffects.map((side, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {side}
              </span>
            ))}
          </div>
        </section>

        {/* 7. Storage Instructions */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Thermometer className="w-4 h-4 text-[#0D9488]" />
            <h2 className="text-sm font-bold text-slate-900">Storage Instructions</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {medicine.storageInstructions}
          </p>
        </section>
      </div>

      {/* 8. Information Sources */}
      <section className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <FileText className="w-4 h-4 text-[#2563EB]" />
          <span>Authoritative Information Sources</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600">
          {medicine.informationSources.map((src, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>{src}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
