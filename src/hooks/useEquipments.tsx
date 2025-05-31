
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Equipment {
  id: string;
  equipment_id: string;
  type: string;
  brand: string;
  model: string;
  location: string;
  agency: string;
  status: 'operational' | 'maintenance' | 'critical' | 'offline';
  technician: string | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  temperature: string | null;
  serial_number: string;
  created_at: string;
  updated_at: string;
}

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion pour s'assurer que les données correspondent au type Equipment
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'operational' | 'maintenance' | 'critical' | 'offline'
      }));

      setEquipments(typedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements:', error);
      toast.error('Erreur lors de la récupération des équipements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const refetch = () => {
    fetchEquipments();
  };

  return {
    equipments,
    isLoading,
    refetch,
  };
}
