import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'warning' | 'danger' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-[#2563EB] border-blue-200/70',
    teal: 'bg-teal-50 text-[#0D9488] border-teal-200/70',
    warning: 'bg-amber-50 text-[#F59E0B] border-amber-200/70',
    danger: 'bg-red-50 text-[#DC2626] border-red-200/70',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

