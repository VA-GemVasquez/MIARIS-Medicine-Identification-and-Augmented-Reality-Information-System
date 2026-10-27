import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Scan,
  BookOpen,
  Bell,
  Info,
  Home,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import miarisLogo from '../../assets/MIARIS_LOGO.png';

export const Navbar: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Scan Medicine', path: '/scanner', icon: Scan },
    { name: 'AR View', path: '/ar', icon: Sparkles },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Reminders', path: '/reminders', icon: Bell },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={miarisLogo}
              alt="MIARIS Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-[#2563EB] transition-colors">
                  MIARIS
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-[#0D9488] border border-teal-200">
                  <ShieldCheck className="w-3 h-3" />
                  AR Health
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 -mt-0.5">
                Medicine Identification & Information System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-[#2563EB] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#0D9488] hover:opacity-95 shadow-sm shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Scan</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

