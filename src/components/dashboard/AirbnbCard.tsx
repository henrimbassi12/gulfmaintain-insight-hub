
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AirbnbCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  gradient?: string;
}

export function AirbnbCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  onClick,
  gradient = "from-blue-50 to-blue-100/50"
}: AirbnbCardProps) {
  return (
    <Card 
      className="bg-white border border-gray-100 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-gray-200 rounded-2xl overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className={`bg-gradient-to-br ${gradient} p-6 border-b border-gray-100/50`}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            {trend && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                trend.isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-sm font-medium mb-3">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
