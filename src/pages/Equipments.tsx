
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Plus } from "lucide-react";
import { EquipmentStats } from '@/components/EquipmentStats';
import { EquipmentFilters } from '@/components/EquipmentFilters';
import { EquipmentList } from '@/components/EquipmentList';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';
import { useEquipments } from '@/hooks/useEquipments';

const Equipments = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    agency: 'all',
    technician: 'all',
    search: ''
  });

  const { equipments, isLoading, refetch } = useEquipments();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filter equipments based on current filters
  const filteredEquipments = equipments.filter(equipment => {
    const matchesStatus = filters.status === 'all' || equipment.status === filters.status;
    const matchesType = filters.type === 'all' || equipment.type.toLowerCase().includes(filters.type.toLowerCase());
    const matchesAgency = filters.agency === 'all' || equipment.agency === filters.agency;
    const matchesTechnician = filters.technician === 'all' || equipment.technician === filters.technician;
    const matchesSearch = filters.search === '' || 
      equipment.equipment_id.toLowerCase().includes(filters.search.toLowerCase()) ||
      equipment.type.toLowerCase().includes(filters.search.toLowerCase()) ||
      equipment.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      equipment.location.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesType && matchesAgency && matchesTechnician && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Équipements</h1>
            <p className="text-gray-600">Gestion et suivi de tous les équipements</p>
          </div>
        </div>
        <AddEquipmentForm onSuccess={refetch} />
      </div>

      {/* Statistics */}
      <EquipmentStats equipments={equipments} isLoading={isLoading} />

      {/* Filters */}
      <EquipmentFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        equipments={equipments}
      />

      {/* Equipment List */}
      <EquipmentList 
        equipments={equipments}
        filteredEquipments={filteredEquipments}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Equipments;
