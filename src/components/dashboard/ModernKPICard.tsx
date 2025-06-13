
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModernKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}

export function ModernKPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  bgColor,
  iconColor,
  onClick
}: ModernKPICardProps) {
  return (
    <Card 
      className={`${bgColor} border-0 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {subtitle && (
              <p className="text-white/70 text-xs">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span className="text-white/90 text-sm font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-white/70 text-xs ml-1">vs mois dernier</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
