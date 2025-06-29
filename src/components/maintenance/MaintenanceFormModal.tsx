
import React from 'react';
import { EnhancedMaintenanceForm } from './EnhancedMaintenanceForm';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MaintenanceFormModal({ isOpen, onClose, onSuccess }: MaintenanceFormModalProps) {
  return (
    <EnhancedMaintenanceForm 
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess} 
    />
  );
}
