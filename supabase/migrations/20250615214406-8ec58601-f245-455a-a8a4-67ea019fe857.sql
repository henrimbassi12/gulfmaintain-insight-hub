
-- D'abord, on crée une fonction qui sera chargée d'appeler notre service de notification.
-- Elle est conçue pour ne pas bloquer l'inscription de l'utilisateur même si l'envoi de la notification échoue.
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_user()
RETURNS TRIGGER AS $$
DECLARE
  -- L'URL de notre future fonction de notification
  notification_url TEXT := 'https://swivaiakgzzzwdumnbam.supabase.co/functions/v1/send-notification-email';
  -- La clé publique (anon) de notre projet Supabase
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aXZhaWFrZ3p6endkdW1uYmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDM4OTksImV4cCI6MjA2NDE3OTg5OX0.PzLxdl1spnEosej2XNiJQnQ2rxOv4VT5TF5xcU6ms7Y';
BEGIN
  BEGIN
    -- On tente d'envoyer les informations du nouvel utilisateur à notre service de notification
    PERFORM net.http_post(
      url := notification_url,
      body := json_build_object(
        'new_user_name', NEW.full_name,
        'new_user_email', NEW.email,
        'new_user_role', NEW.role
      )::jsonb,
      headers := json_build_object(
        'Content-Type', 'application/json',
        'apikey', anon_key,
        'Authorization', 'Bearer ' || anon_key
      )::jsonb
    );
  -- En cas d'erreur (ex: le service de notification est temporairement indisponible),
  -- on lève un avertissement sans faire échouer l'inscription.
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to call notification edge function: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensuite, on crée le "déclencheur" (trigger) qui exécute notre fonction
-- juste après qu'un nouvel utilisateur soit inséré dans la table 'profiles'.
CREATE TRIGGER on_profile_insert_notify_admins
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_on_new_user();

