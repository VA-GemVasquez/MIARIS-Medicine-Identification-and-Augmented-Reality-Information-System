import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar (hidden on mobile/tablet) */}
        <Sidebar className="hidden lg:flex" />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <BottomNavigation />
    </div>
  );
};

