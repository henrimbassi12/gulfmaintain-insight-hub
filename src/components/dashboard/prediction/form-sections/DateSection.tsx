
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictionData } from '../types';

interface DateSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function DateSection({ formData, onInputChange }: DateSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Date d'intervention</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date" className="text-xs">Date</Label>
          <Input
            id="date"
            type="date"
            size="sm"
            value={formData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
