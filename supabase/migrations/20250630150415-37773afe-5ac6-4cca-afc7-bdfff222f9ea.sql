
-- Créer la table planned_maintenances pour stocker les planifications de maintenance
CREATE TABLE public.planned_maintenances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Planification de la maintenance
  type_maintenance TEXT NOT NULL,
  priorite TEXT NOT NULL,
  duree_estimee TEXT NOT NULL,
  date_programmee DATE NOT NULL,
  
  -- Informations de base
  date_creation DATE NOT NULL,
  technician_assigne TEXT NOT NULL,
  
  -- Organisation
  division TEXT NOT NULL,
  secteur TEXT NOT NULL,
  partenaire TEXT NOT NULL,
  ville TEXT NOT NULL,
  
  -- Client & Point de vente
  nom_client TEXT NOT NULL,
  nom_pdv TEXT NOT NULL,
  tel_barman TEXT NOT NULL,
  quartier TEXT NOT NULL,
  localisation TEXT NOT NULL,
  
  -- Spécifications techniques
  serial_number TEXT NOT NULL,
  tag_number TEXT NOT NULL,
  type_frigo TEXT NOT NULL,
  af_nf TEXT NOT NULL,
  branding TEXT NOT NULL,
  
  -- Description
  description TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_planned_maintenances_date_programmee ON public.planned_maintenances(date_programmee);
CREATE INDEX idx_planned_maintenances_technician ON public.planned_maintenances(technician_assigne);
CREATE INDEX idx_planned_maintenances_ville ON public.planned_maintenances(ville);
CREATE INDEX idx_planned_maintenances_priorite ON public.planned_maintenances(priorite);

-- Activer la réplication en temps réel
ALTER TABLE public.planned_maintenances REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.planned_maintenances;
