
-- Supprimer les messages des conversations non désirées
DELETE FROM public.messages 
WHERE conversation_id IN (
  SELECT id FROM public.conversations 
  WHERE name IN ('Support Technique', 'Équipe Maintenance', 'Inspections')
);

-- Supprimer les participants des conversations non désirées
DELETE FROM public.conversation_participants 
WHERE conversation_id IN (
  SELECT id FROM public.conversations 
  WHERE name IN ('Support Technique', 'Équipe Maintenance', 'Inspections')
);

-- Supprimer les conversations non désirées
DELETE FROM public.conversations 
WHERE name IN ('Support Technique', 'Équipe Maintenance', 'Inspections');
