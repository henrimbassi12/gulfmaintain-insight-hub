
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface ModernStatsGridProps {
  title: string;
  stats: StatItem[];
}

export function ModernStatsGrid({ title, stats }: ModernStatsGridProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              {stat.change && (
                <p className={`text-xs font-medium ${
                  stat.isPositive ? 'text-blue-600' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
