import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-5 animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested page route does not exist in the MIARIS application.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4" />
            Back to Home Overview
          </Button>
        </Link>
      </div>
    </div>
  );
};

