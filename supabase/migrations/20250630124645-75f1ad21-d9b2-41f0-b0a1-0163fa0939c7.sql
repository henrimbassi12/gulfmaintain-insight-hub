
-- Étape 1: Créer une sauvegarde de la table existante
CREATE TABLE temp_equipments_backup AS SELECT * FROM public.equipments;

-- Étape 2: Supprimer la table existante
DROP TABLE IF EXISTS public.equipments CASCADE;

-- Étape 3: Créer la nouvelle table equipments avec la structure exacte demandée
CREATE TABLE public.equipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  technician text NOT NULL,
  division text NOT NULL,
  secteur text NOT NULL,
  partenaire text NOT NULL,
  ville text NOT NULL,
  nom_client text NOT NULL,
  nom_pdv text NOT NULL,
  tel_barman text NOT NULL,
  quartier text NOT NULL,
  localisation text NOT NULL,
  type_frigo text NOT NULL,
  af_nf text NOT NULL CHECK (af_nf IN ('AF', 'NF')),
  branding text NOT NULL,
  serial_number text NOT NULL,
  tag_number text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Étape 4: Migrer les données existantes (en adaptant les champs)
INSERT INTO public.equipments (
  id, date, technician, division, secteur, partenaire, ville, 
  nom_client, nom_pdv, tel_barman, quartier, localisation, 
  type_frigo, af_nf, branding, serial_number, tag_number, 
  created_at, updated_at
)
SELECT 
  id,
  COALESCE(created_at::date, CURRENT_DATE) as date,
  COALESCE(technician, 'Non assigné') as technician,
  COALESCE(agency, 'Division non spécifiée') as division,
  'Secteur non spécifié' as secteur,
  'Partenaire non spécifié' as partenaire,
  COALESCE(agency, 'Ville non spécifiée') as ville,
  'Client non spécifié' as nom_client,
  COALESCE(location, 'PDV non spécifié') as nom_pdv,
  'Tel non spécifié' as tel_barman,
  'Quartier non spécifié' as quartier,
  COALESCE(location, 'Localisation non spécifiée') as localisation,
  COALESCE(type, 'INNOVA 420') as type_frigo,
  'NF' as af_nf,
  COALESCE(brand, 'GUINNESS') as branding,
  COALESCE(serial_number, 'N/A' || id::text) as serial_number,
  'TAG' || extract(epoch from created_at)::text as tag_number,
  created_at,
  updated_at
FROM temp_equipments_backup;

-- Étape 5: Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_equipments_technician ON public.equipments(technician);
CREATE INDEX IF NOT EXISTS idx_equipments_ville ON public.equipments(ville);
CREATE INDEX IF NOT EXISTS idx_equipments_type_frigo ON public.equipments(type_frigo);
CREATE INDEX IF NOT EXISTS idx_equipments_serial_number ON public.equipments(serial_number);
CREATE INDEX IF NOT EXISTS idx_equipments_tag_number ON public.equipments(tag_number);

-- Étape 6: Activer RLS
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Allow all authenticated users to view equipments" 
ON public.equipments FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow all authenticated users to insert equipments" 
ON public.equipments FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update equipments" 
ON public.equipments FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow all authenticated users to delete equipments" 
ON public.equipments FOR DELETE 
TO authenticated 
USING (true);

-- Étape 7: Supprimer la table de sauvegarde
DROP TABLE IF EXISTS temp_equipments_backup;
