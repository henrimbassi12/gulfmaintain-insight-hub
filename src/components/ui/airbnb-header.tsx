
import React from 'react';
import { LucideIcon } from "lucide-react";

interface AirbnbHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function AirbnbHeader({ title, subtitle, icon: Icon, children }: AirbnbHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 gap-4 lg:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">{title}</h1>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{subtitle}</p>
            </div>
          </div>
          
          {children && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto lg:flex-nowrap">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
