-- Activer la réplication en temps réel pour la table failure_predictions
ALTER TABLE public.failure_predictions REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.failure_predictions;