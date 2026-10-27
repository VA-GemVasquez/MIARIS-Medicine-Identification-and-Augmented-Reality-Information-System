import React from 'react';
import {
  ShieldAlert,
  Code2,
  Database,
  Eye,
  Info,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import miarisLogo from '../assets/MIARIS_LOGO.png';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Project Title & Educational Purpose */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={miarisLogo}
            alt="MIARIS Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl shadow-sm border border-slate-100 p-1 shrink-0 bg-slate-50"
          />
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
              <Info className="w-3.5 h-3.5" />
              Academic & Educational Project Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              About MIARIS
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <strong>MIARIS</strong> (Medicine Identification and Information System) is an educational digital healthcare application concept designed to study how Augmented Reality (AR), computer vision, and structured drug monographs can assist in identifying pharmaceutical packaging and preventing medication errors.
        </p>
      </section>

      {/* 2. Educational Nature & Disclaimer Notice */}
      <section className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <span>Educational Simulation Notice & Limitations</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          MIARIS is strictly developed for educational demonstration and user experience research. The drug monographs, target descriptors, and dosage tables presented in this software are sample records compiled from publicly accessible reference frameworks.
        </p>
        <div className="pt-1 text-xs text-amber-900/90 space-y-1">
          <p>• <strong>Do not use for self-diagnosis or self-treatment:</strong> Always follow the specific instructions on your dispensed prescription label and consult your licensed physician or pharmacist.</p>
          <p>• <strong>Medical Emergencies:</strong> In the event of an adverse drug reaction, accidental ingestion, or overdose, contact emergency medical services (such as 911 or your local poison control hotline) immediately.</p>
        </div>
      </section>

      {/* 3. Core Functional Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Augmented Reality Identification
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explores visual target tracking to recognize medicine boxes, bottles, and blister packs in real time through web cameras.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Structured Drug Monographs
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consolidates active generic substances, therapeutic indications, dosage precautions, contraindications, and storage rules.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Adherence & Intake Logging
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Facilitates medication adherence through customizable daily reminder timetables and taken/pending status tracking.
          </p>
        </div>
      </section>

      {/* 4. Demonstration Reference Sources */}
      <section className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
          <span>Clinical Demonstration Reference Frameworks</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The sample monographs in this application draw upon standards published by public health agencies:
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li><strong>U.S. Food & Drug Administration (FDA)</strong> — National Drug Code Directory and approved drug product inserts.</li>
          <li><strong>U.S. National Library of Medicine</strong> — DailyMed drug labeling database.</li>
          <li><strong>World Health Organization (WHO)</strong> — Model List of Essential Medicines (EML).</li>
          <li><strong>MedlinePlus Health Information</strong> — Drug, herb, and supplement health guides.</li>
        </ul>
      </section>

      {/* 5. Technology Architecture */}
      <section className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#2563EB]" />
          <span>Technology Architecture</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Built as a fast, accessible Single Page Application (SPA):
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-[#2563EB] block">React 19</span>
            <span className="text-[11px] text-slate-500">Component UI</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-[#0D9488] block">TypeScript</span>
            <span className="text-[11px] text-slate-500">Strict Type Safety</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-800 block">Tailwind CSS</span>
            <span className="text-[11px] text-slate-500">Medical Design System</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-purple-700 block">Vite 8</span>
            <span className="text-[11px] text-slate-500">Development Tooling</span>
          </div>
        </div>
      </section>
    </div>
  );
};
