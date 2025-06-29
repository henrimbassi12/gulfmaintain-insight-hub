
import React from 'react';
import { EnhancedMaintenanceForm } from './EnhancedMaintenanceForm';

interface MaintenanceFormModalProps {
  onSuccess: () => void;
}

export function MaintenanceFormModal({ onSuccess }: MaintenanceFormModalProps) {
  return <EnhancedMaintenanceForm onSuccess={onSuccess} />;
}
