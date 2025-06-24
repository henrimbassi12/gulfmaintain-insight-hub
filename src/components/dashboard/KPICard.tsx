
import React from 'react';
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function KPICard({ title, value, icon: Icon }: KPICardProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
