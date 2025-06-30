
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className = "",
  onClick
}: DashboardCardProps) {
  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
        <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">{title}</CardTitle>
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
