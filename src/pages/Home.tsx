import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scan,
  BookOpen,
  Bell,
  Search,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { medicines } from '../data/medicines';
import { MedicineCard } from '../components/medicine/MedicineCard';
import { useAppStore } from '../store';
import type { Medicine } from '../types/medicine';
import miarisLogo from '../assets/MIARIS_LOGO.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Read from Zustand store
  const recentlyViewedIds = useAppStore((state) => state.recentlyViewedIds);
  const reminders = useAppStore((state) => state.reminders);

  // Derive recently viewed medicines
  const recentlyViewed = useMemo(() => {
    const list = recentlyViewedIds
      .map((id) => medicines.find((m) => m.id === id))
      .filter((m): m is Medicine => Boolean(m));
    return list.length > 0 ? list.slice(0, 3) : medicines.slice(0, 3);
  }, [recentlyViewedIds]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/library');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Welcome Header & Logo */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={miarisLogo}
              alt="MIARIS Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl shadow-sm border border-slate-100 p-1 shrink-0 bg-slate-50"
            />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#2563EB]">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                Medicine Identification & Information System
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome to MIARIS
              </h1>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                Identify medication packaging using camera tracking, review clinical drug monographs, and manage daily dosage schedules.
              </p>
            </div>
          </div>

          {/* Prominent Scan Medicine CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Scan className="w-5 h-5" />
              <span>Scan Medicine Now</span>
            </Link>
          </div>
        </div>

        {/* Medicine Search Field */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic formula, or symptom (e.g. Paracetamol, Advil, allergy)..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 2. Quick-Access Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Scanner Card */}
        <Link
          to="/scanner"
          className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Scan className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
              Medicine Scanner
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Launch camera viewfinder to aim at medicine packaging, blister packs, or product barcodes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#2563EB] gap-1">
            <span>Open Scanner</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Medicine Library Card */}
        <Link
          to="/library"
          className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-[#0D9488] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors">
              Medicine Library
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Explore {medicines.length} categorized drug monographs with dosage forms, contraindications, and storage rules.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#0D9488] gap-1">
            <span>Browse Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Reminders Card */}
        <Link
          to="/reminders"
          className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-[#F59E0B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Dosage Reminders
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Manage your daily medication timetable, track doses taken, and maintain adherence.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700 gap-1">
            <span>View Timetable</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* 3. Recently Viewed Medicines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Recently Viewed Medicines
            </h2>
            <p className="text-xs text-slate-500">
              Quick access to clinical records you inspected
            </p>
          </div>
          <Link
            to="/library"
            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
          >
            <span>View all in Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentlyViewed.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </section>

      {/* 4. Active Today's Schedule Overview */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-slate-900">
              Today's Scheduled Medications ({reminders.length} items)
            </h3>
          </div>
          <Link to="/reminders" className="text-xs font-bold text-[#2563EB] hover:underline">
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reminders.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 block">{r.medicineName}</span>
                <span className="text-slate-500 text-[11px]">{r.dosage} • {r.instructions}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px] bg-blue-100 text-[#2563EB]">
                  {r.scheduledTime || r.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Educational Medicine Safety Notice */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-2.5">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <span>Educational Medicine Safety Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
          MIARIS is designed strictly as an academic educational interface and drug information guide. All medicine records labeled as <strong>Demo Record</strong> are provided for software interface demonstration purposes.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Always verify actual drug packaging, expiration dates, and physician instructions.</span>
          </div>
          <Link
            to="/about"
            className="text-[#2563EB] font-bold hover:underline shrink-0"
          >
            Learn more about MIARIS &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
