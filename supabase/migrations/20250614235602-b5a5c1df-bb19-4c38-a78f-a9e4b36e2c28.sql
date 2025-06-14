
-- Créer un type enum pour le statut des comptes
CREATE TYPE public.account_status AS ENUM ('pending', 'approved', 'rejected');

-- Ajouter une colonne pour le statut du compte dans la table profiles
ALTER TABLE public.profiles ADD COLUMN account_status account_status DEFAULT 'pending';

-- Ajouter une colonne pour la date d'approbation
ALTER TABLE public.profiles ADD COLUMN approved_at timestamp with time zone;

-- Ajouter une colonne pour l'ID de l'administrateur qui a approuvé
ALTER TABLE public.profiles ADD COLUMN approved_by uuid REFERENCES public.profiles(id);

-- Mettre à jour les comptes existants comme approuvés (pour ne pas casser le fonctionnement actuel)
UPDATE public.profiles SET account_status = 'approved', approved_at = now() WHERE account_status IS NULL;

-- Créer une fonction pour approuver un utilisateur
CREATE OR REPLACE FUNCTION public.approve_user(user_id uuid, approver_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'approved',
    approved_at = now(),
    approved_by = approver_id
  WHERE id = user_id;
END;
$$;

-- Créer une fonction pour rejeter un utilisateur
CREATE OR REPLACE FUNCTION public.reject_user(user_id uuid, approver_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'rejected',
    approved_at = now(),
    approved_by = approver_id
  WHERE id = user_id;
END;
$$;

-- Créer une vue pour les utilisateurs en attente (accessible seulement aux admins)
CREATE OR REPLACE VIEW public.pending_users AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.agency,
  p.created_at,
  p.account_status
FROM public.profiles p
WHERE p.account_status = 'pending'
ORDER BY p.created_at ASC;

-- Politique RLS pour la vue des utilisateurs en attente (seulement les admins)
CREATE POLICY "Only admins can view pending users" 
ON public.profiles 
FOR SELECT 
USING (
  account_status = 'pending' AND 
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
    AND admin_profile.account_status = 'approved'
  )
);
