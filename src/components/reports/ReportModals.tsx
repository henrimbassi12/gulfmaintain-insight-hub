
import React from 'react';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { RepairForm } from '@/components/forms/RepairForm';
import { DepotScheduleForm } from '@/components/forms/DepotScheduleForm';

interface ReportModalsProps {
  isTrackingFormOpen: boolean;
  setTrackingFormOpen: (isOpen: boolean) => void;
  isMaintenanceFormOpen: boolean;
  setMaintenanceFormOpen: (isOpen: boolean) => void;
  isMovementFormOpen: boolean;
  setMovementFormOpen: (isOpen: boolean) => void;
  isRepairFormOpen: boolean;
  setRepairFormOpen: (isOpen: boolean) => void;
  isDepotFormOpen: boolean;
  setDepotFormOpen: (isOpen: boolean) => void;
  onSaveForm: (data: any) => void;
}

export function ReportModals({
  isTrackingFormOpen,
  setTrackingFormOpen,
  isMaintenanceFormOpen,
  setMaintenanceFormOpen,
  isMovementFormOpen,
  setMovementFormOpen,
  isRepairFormOpen,
  setRepairFormOpen,
  isDepotFormOpen,
  setDepotFormOpen,
  onSaveForm
}: ReportModalsProps) {
  return (
    <>
      <MaintenanceTrackingForm isOpen={isTrackingFormOpen} onClose={() => setTrackingFormOpen(false)} onSave={onSaveForm} />
      <RefrigeratorMaintenanceForm isOpen={isMaintenanceFormOpen} onClose={() => setMaintenanceFormOpen(false)} onSave={onSaveForm} />
      <MovementForm isOpen={isMovementFormOpen} onClose={() => setMovementFormOpen(false)} onSave={onSaveForm} />
      <RepairForm isOpen={isRepairFormOpen} onClose={() => setRepairFormOpen(false)} onSave={onSaveForm} />
      <DepotScheduleForm isOpen={isDepotFormOpen} onClose={() => setDepotFormOpen(false)} onSave={onSaveForm} />
    </>
  );
}
