
-- Supprimer toutes les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Only admins can view pending users" ON public.profiles;

-- Supprimer RLS temporairement pour éviter les problèmes
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Créer de nouvelles politiques simples
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Politique pour permettre aux admins de voir tous les profils
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.account_status = 'approved'
  )
);

-- Politique pour permettre la mise à jour des profils
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Politique pour permettre aux admins de mettre à jour tous les profils
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.account_status = 'approved'
  )
);

-- Corriger la vue pending_users pour éviter les problèmes RLS
DROP VIEW IF EXISTS public.pending_users;

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

-- Politique pour la vue pending_users (accessible aux admins seulement)
CREATE POLICY "Admins can view pending users view" 
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
