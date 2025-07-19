-- Activer RLS sur la table failure_predictions
ALTER TABLE public.failure_predictions ENABLE ROW LEVEL SECURITY;

-- Permettre à tous les utilisateurs authentifiés de lire les prédictions
CREATE POLICY "Users can view all failure predictions" 
ON public.failure_predictions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Permettre à tous les utilisateurs authentifiés de créer des prédictions
CREATE POLICY "Users can create failure predictions" 
ON public.failure_predictions 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Permettre aux admins et managers de modifier les prédictions
CREATE POLICY "Admins and managers can update predictions" 
ON public.failure_predictions 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

-- Permettre aux admins et managers de supprimer les prédictions
CREATE POLICY "Admins and managers can delete predictions" 
ON public.failure_predictions 
FOR DELETE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));