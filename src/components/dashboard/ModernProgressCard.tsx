
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  label: string;
  value: number;
  color: string;
}

interface ModernProgressCardProps {
  title: string;
  items: ProgressItem[];
}

export function ModernProgressCard({ title, items }: ModernProgressCardProps) {
  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
              <span className="text-sm font-bold text-gray-800">{item.value}%</span>
            </div>
            <Progress 
              value={item.value} 
              className="h-2"
              style={{
                background: '#f1f5f9'
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
