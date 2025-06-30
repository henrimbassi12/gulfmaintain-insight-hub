
import React from 'react';
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function KPICard({ title, value, icon: Icon }: KPICardProps) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">{title}</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
