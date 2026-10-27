import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Scan,
  Sparkles,
  BookOpen,
  Bell,
  Info,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { medicines } from '../../data/medicines';
import { useAppStore } from '../../store';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const reminders = useAppStore((state) => state.reminders);
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;

  const menuItems = [
    { label: 'Overview', path: '/', icon: Home, badge: undefined },
    { label: 'Scan Medicine', path: '/scanner', icon: Scan, badge: 'Camera' },
    { label: 'AR Display', path: '/ar', icon: Sparkles, badge: 'Interactive' },
    { label: 'Medicine Library', path: '/library', icon: BookOpen, badge: `${medicines.length} items` },
    { label: 'Dosage Reminders', path: '/reminders', icon: Bell, badge: `${pendingCount} pending` },
    { label: 'About & Safety', path: '/about', icon: Info, badge: undefined },
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4 ${className}`}
    >
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-[#2563EB] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System Status Card */}
        <div className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0D9488]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]"></span>
            </span>
            System Status
          </div>
          <p className="mt-1 text-xs text-slate-600">
            AR Target Engine & Local Database operational.
          </p>
          <div className="mt-2.5 pt-2 border-t border-teal-100/80 flex items-center justify-between text-[11px] text-teal-800 font-semibold">
            <span>Offline-Ready</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Safety Notice Box */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
            Medical Disclaimer
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-900/80">
            MIARIS is an identification guide and does not replace medical consultation.
          </p>
          <NavLink
            to="/about"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:underline"
          >
            Learn more <ExternalLink className="w-3 h-3" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
