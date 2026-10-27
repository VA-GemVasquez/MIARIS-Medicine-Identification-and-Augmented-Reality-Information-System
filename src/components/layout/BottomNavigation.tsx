import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Sparkles, BookOpen, Bell } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const tabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Library', path: '/library', icon: BookOpen },
    { label: 'Scan', path: '/scanner', icon: Scan, isCenter: true },
    { label: 'AR', path: '/ar', icon: Sparkles },
    { label: 'Reminders', path: '/reminders', icon: Bell },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center -mt-5 group focus:outline-none"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                        isActive
                          ? 'bg-gradient-to-tr from-[#2563EB] to-[#0D9488] ring-4 ring-blue-100'
                          : 'bg-gradient-to-tr from-[#2563EB] to-blue-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-1 ${
                        isActive ? 'text-[#2563EB]' : 'text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

