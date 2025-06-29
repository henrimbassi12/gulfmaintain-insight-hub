
import React from 'react';
import { PredictionData } from './types';
import { TechnicalDataSection } from './form-sections/TechnicalDataSection';
import { PersonnelSection } from './form-sections/PersonnelSection';
import { LocationSection } from './form-sections/LocationSection';
import { EquipmentSection } from './form-sections/EquipmentSection';
import { TechnicalOptionsSection } from './form-sections/TechnicalOptionsSection';
import { DateSection } from './form-sections/DateSection';

interface PredictionFormFieldsProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
  onNumberInputChange: (field: keyof PredictionData, value: string) => void;
}

export function PredictionFormFields({ formData, onInputChange, onNumberInputChange }: PredictionFormFieldsProps) {
  return (
    <div className="space-y-4">
      <TechnicalDataSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <PersonnelSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <LocationSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <EquipmentSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <TechnicalOptionsSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <DateSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />
    </div>
  );
}
