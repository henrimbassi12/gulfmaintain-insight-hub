-- Enable RLS on planned_maintenances table
ALTER TABLE public.planned_maintenances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for planned_maintenances
CREATE POLICY "Admins and managers can view all planned maintenances" 
ON public.planned_maintenances 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Technicians can view their assigned maintenances" 
ON public.planned_maintenances 
FOR SELECT 
USING (technician_assigne = get_current_user_full_name());

CREATE POLICY "Admins and managers can create planned maintenances" 
ON public.planned_maintenances 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Admins and managers can update planned maintenances" 
ON public.planned_maintenances 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Admins and managers can delete planned maintenances" 
ON public.planned_maintenances 
FOR DELETE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

-- Enable RLS on technician_recommendations table
ALTER TABLE public.technician_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for technician_recommendations
CREATE POLICY "Admins and managers can view all technician recommendations" 
ON public.technician_recommendations 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Technicians can view recommendations related to them" 
ON public.technician_recommendations 
FOR SELECT 
USING (technician = get_current_user_full_name() OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins and managers can create technician recommendations" 
ON public.technician_recommendations 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Admins and managers can update technician recommendations" 
ON public.technician_recommendations 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Admins and managers can delete technician recommendations" 
ON public.technician_recommendations 
FOR DELETE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

-- Secure all SECURITY DEFINER functions by adding proper search_path
CREATE OR REPLACE FUNCTION public.approve_user(user_id uuid, approver_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'approved',
    approved_at = now(),
    approved_by = approver_id
  WHERE id = user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_user(user_id uuid, approver_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'rejected',
    approved_at = now(),
    approved_by = approver_id
  WHERE id = user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_full_name()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT full_name FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_approved()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND account_status = 'approved'
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'technician')
  );
  RETURN NEW;
END;
$function$;