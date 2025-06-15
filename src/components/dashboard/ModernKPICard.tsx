
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModernKPICardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function ModernKPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  onClick
}: ModernKPICardProps) {
  return (
    <Card 
      className="bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-200"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            {subtitle && (
              <p className="text-gray-500 text-xs">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-3">
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-blue-600' : 'text-red-500'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-gray-500 text-xs ml-2">vs mois dernier</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-blue-50">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
