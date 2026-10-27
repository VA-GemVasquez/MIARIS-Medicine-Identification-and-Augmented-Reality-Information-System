import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import miarisLogo from '../../assets/MIARIS_LOGO.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={miarisLogo}
                alt="MIARIS Logo"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                MIARIS
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Medicine Identification and Information System — utilizing augmented reality and computer vision to deliver immediate, verified medication details and dosage reminders.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Built with React, TypeScript & Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#2563EB] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-[#2563EB] transition-colors">
                  Medicine Scanner
                </Link>
              </li>
              <li>
                <Link to="/ar" className="hover:text-[#2563EB] transition-colors">
                  AR Display
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-[#2563EB] transition-colors">
                  Medicine Library
                </Link>
              </li>
              <li>
                <Link to="/reminders" className="hover:text-[#2563EB] transition-colors">
                  Dosage Reminders
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Safety & Info
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:text-[#2563EB] transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <a
                  href="https://www.fda.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
                >
                  FDA Drug Safety <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://medlineplus.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
                >
                  MedlinePlus Guide <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Warning Box */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-slate-800">Important Medical Disclaimer:</strong> The information provided by MIARIS is for reference and identification assistance only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition or treatment regimen.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} MIARIS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed for patient safety with</span>
            <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-red-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};

