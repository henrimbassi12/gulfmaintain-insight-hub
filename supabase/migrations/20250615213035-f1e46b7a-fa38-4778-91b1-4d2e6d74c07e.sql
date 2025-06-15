
-- D'abord, nous créons une petite fonction pour récupérer facilement le nom complet de l'utilisateur connecté.
CREATE OR REPLACE FUNCTION public.get_current_user_full_name()
RETURNS TEXT AS $$
  SELECT full_name FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Ensuite, on active la sécurité au niveau des lignes sur la table des rapports.
ALTER TABLE public.maintenance_reports ENABLE ROW LEVEL SECURITY;

-- POLITIQUE DE LECTURE (SELECT) :
-- Les admins/managers voient tout. Les techniciens ne voient que leurs propres rapports.
CREATE POLICY "Users can view reports based on role"
ON public.maintenance_reports FOR SELECT USING (
  (public.get_current_user_role() IN ('admin', 'manager')) OR
  (technician = public.get_current_user_full_name())
);

-- POLITIQUE DE CRÉATION (INSERT) :
-- Tout utilisateur connecté (technicien, manager, etc.) peut créer un rapport.
CREATE POLICY "Authenticated users can create reports"
ON public.maintenance_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- POLITIQUE DE MODIFICATION (UPDATE) :
-- Seuls les admins et les managers peuvent modifier un rapport.
CREATE POLICY "Admins and Managers can update reports"
ON public.maintenance_reports FOR UPDATE USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- POLITIQUE DE SUPPRESSION (DELETE) :
-- Seuls les admins et les managers peuvent supprimer un rapport.
CREATE POLICY "Admins and Managers can delete reports"
ON public.maintenance_reports FOR DELETE USING (
  public.get_current_user_role() IN ('admin', 'manager')
);
