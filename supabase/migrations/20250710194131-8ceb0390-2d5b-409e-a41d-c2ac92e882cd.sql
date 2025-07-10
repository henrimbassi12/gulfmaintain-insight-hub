-- Activer le temps réel pour les tables de messages

-- Configurer REPLICA IDENTITY FULL pour capturer toutes les données lors des changements
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_participants REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime pour activer la fonctionnalité temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;