
-- Créer votre profil administrateur
INSERT INTO public.profiles (id, email, full_name, role, account_status, approved_at, created_at, updated_at)
VALUES (
  'db0858c8-9ca8-4177-92d0-17c8e5f5710e', -- Votre user ID d'après les logs d'authentification
  'epandahenri4@gmail.com',
  'EPANDA MBASSI HENRI SOREL',
  'admin',
  'approved',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  approved_at = EXCLUDED.approved_at,
  updated_at = now();

-- Vérifier que le profil a été créé
SELECT id, email, full_name, role, account_status, approved_at 
FROM public.profiles 
WHERE email = 'epandahenri4@gmail.com';
