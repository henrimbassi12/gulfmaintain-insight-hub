-- Supprimer la contrainte check existante sur le champ type si elle existe
ALTER TABLE public.failure_predictions DROP CONSTRAINT IF EXISTS failure_predictions_type_check;

-- Ajouter une nouvelle contrainte check avec les valeurs appropriées
ALTER TABLE public.failure_predictions ADD CONSTRAINT failure_predictions_type_check 
CHECK (type IN ('Préventive', 'Corrective', 'Urgente', 'Prédictive'));

-- Insérer des données de test pour la page Historique
INSERT INTO public.failure_predictions (
  equipment_id, 
  equipment_name, 
  predicted_date, 
  failure_risk, 
  recommended_action, 
  type, 
  location, 
  confidence_score,
  equipment_brand,
  equipment_model
) VALUES 
('FRIGO-001', 'Réfrigérateur Showroom Principal', '2025-01-30', 85, 'Investigation défaillance compresseur', 'Prédictive', 'Douala Centre', 9.2, 'Samsung', 'RS68N8230S9'),
('FRIGO-002', 'Congélateur Dépôt Nord', '2025-02-15', 65, 'Entretien renforcé condenseur', 'Préventive', 'Douala Akwa', 7.8, 'LG', 'GC-B247SQUVV'),
('FRIGO-003', 'Vitrine Réfrigérée Boutique', '2025-02-10', 45, 'Maintenance préventive standard', 'Préventive', 'Yaoundé Centre', 6.8, 'Whirlpool', 'WHM39132'),
('FRIGO-004', 'Chambre Froide Restaurant', '2025-01-25', 90, 'Investigation urgente capteurs', 'Urgente', 'Douala Bonapriso', 9.5, 'Carrier', 'CF-2000X'),
('FRIGO-005', 'Présentoir Boissons Magasin', '2025-03-01', 25, 'Surveillance renforcée', 'Préventive', 'Bafoussam Centre', 5.5, 'Coca-Cola', 'CC-Display-500'),
('FRIGO-006', 'Congélateur Entrepôt Sud', '2025-02-20', 75, 'Remplacement thermostat défaillant', 'Corrective', 'Douala Bassa', 8.3, 'Electrolux', 'EUF2743AOW'),
('FRIGO-007', 'Armoire Réfrigérée Café', '2025-02-05', 55, 'Nettoyage et vérification circuits', 'Préventive', 'Yaoundé Mfoundi', 7.1, 'Liebherr', 'FKv 4143'),
('FRIGO-008', 'Chambre Froide Hôtel', '2025-01-28', 88, 'Diagnostic complet système réfrigération', 'Prédictive', 'Douala Wouri', 9.1, 'Zanussi', 'ZFC31402WA')