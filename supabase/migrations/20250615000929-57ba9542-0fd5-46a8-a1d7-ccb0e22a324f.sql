
-- Approuver votre compte administrateur (remplacez l'email par le vôtre)
UPDATE public.profiles 
SET 
  account_status = 'approved',
  approved_at = now()
WHERE email = 'epandahenri4@gmail.com' AND role = 'admin';

-- Vérifier que la mise à jour a fonctionné
SELECT id, email, full_name, role, account_status, approved_at 
FROM public.profiles 
WHERE email = 'epandahenri4@gmail.com';
