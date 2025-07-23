-- Supprimer les données de test insérées précédemment
DELETE FROM public.failure_predictions 
WHERE equipment_id IN ('FRIGO-001', 'FRIGO-002', 'FRIGO-003', 'FRIGO-004', 'FRIGO-005', 'FRIGO-006', 'FRIGO-007', 'FRIGO-008');