
import React from 'react';
import { LucideIcon } from "lucide-react";
import { ConnectionStatus } from '@/components/ConnectionStatus';

interface AirbnbHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function AirbnbHeader({ title, subtitle, icon: Icon, children }: AirbnbHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            <ConnectionStatus />
          </div>
          
          {children && (
            <div className="flex items-center gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
