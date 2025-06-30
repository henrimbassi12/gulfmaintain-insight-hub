
-- Mise à jour de la table maintenance_reports pour ajouter les champs manquants
ALTER TABLE public.maintenance_reports 
ADD COLUMN IF NOT EXISTS equipment_brand text,
ADD COLUMN IF NOT EXISTS equipment_model text,
ADD COLUMN IF NOT EXISTS equipment_serial_number text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS assigned_technician text,
ADD COLUMN IF NOT EXISTS completion_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS next_maintenance_date date;

-- Mise à jour de la table failure_predictions pour améliorer les champs
ALTER TABLE public.failure_predictions 
ADD COLUMN IF NOT EXISTS equipment_brand text,
ADD COLUMN IF NOT EXISTS equipment_model text,
ADD COLUMN IF NOT EXISTS equipment_serial_number text,
ADD COLUMN IF NOT EXISTS maintenance_history jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS environmental_factors jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS usage_pattern text,
ADD COLUMN IF NOT EXISTS confidence_score numeric(3,2) DEFAULT 0.00;

-- Mise à jour de la table technician_recommendations pour plus de détails
ALTER TABLE public.technician_recommendations 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS certification_level text,
ADD COLUMN IF NOT EXISTS specialization text[],
ADD COLUMN IF NOT EXISTS current_workload integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating numeric(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS last_assignment_date date;

-- Mise à jour de la table profiles pour les informations utilisateur complètes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialization text[],
ADD COLUMN IF NOT EXISTS certification_level text,
ADD COLUMN IF NOT EXISTS experience_years integer,
ADD COLUMN IF NOT EXISTS current_location text,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available',
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "sms": false, "push": true}';

-- Mise à jour des contraintes et index pour de meilleures performances
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_equipment ON public.maintenance_reports(equipment);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_technician ON public.maintenance_reports(technician);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_date ON public.maintenance_reports(date);
CREATE INDEX IF NOT EXISTS idx_failure_predictions_risk ON public.failure_predictions(failure_risk);
CREATE INDEX IF NOT EXISTS idx_technician_recommendations_score ON public.technician_recommendations(match_score);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON public.profiles(availability_status);

-- Mise à jour des valeurs par défaut pour les enums existants
UPDATE public.maintenance_reports 
SET priority = 'medium' 
WHERE priority IS NULL;

UPDATE public.profiles 
SET availability_status = 'available' 
WHERE availability_status IS NULL;
