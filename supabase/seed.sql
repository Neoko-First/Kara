-- Seed Kara — données de démonstration
-- Exécuté par `supabase db reset` (tourne en tant que superuser → RLS bypassé)
--
-- UUIDs fixes pour reproductibilité :
--   Utilisateurs  : a{n}000000-0000-0000-0000-000000000000
--   Véhicules     : b{owner}{n}000000-0000-0000-0000-000000000000
--   Photos        : c0000000-0000-0000-0000-{n sur 12 digits}
--   Conversations : d0000000-0000-0000-0000-{n sur 12 digits}
--   Messages      : 00000000-0000-0000-0000-{n sur 12 digits}

-- ─── 1. Utilisateurs auth ─────────────────────────────────────────────────────
-- Le trigger on_auth_user_created crée automatiquement les profils associés
INSERT INTO auth.users (
  id, instance_id,
  aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  is_sso_user
) VALUES
  (
    'a1000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'lucas.martin@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '6 months',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Lucas Martin"}'::jsonb,
    now() - interval '6 months', now() - interval '6 months',
    false
  ),
  (
    'a2000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sofia.dubois@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '5 months',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Sofia Dubois"}'::jsonb,
    now() - interval '5 months', now() - interval '5 months',
    false
  ),
  (
    'a3000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'marc.girard@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '4 months',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Marc Girard"}'::jsonb,
    now() - interval '4 months', now() - interval '4 months',
    false
  ),
  (
    'a4000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'emma.bernard@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '3 months',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Emma Bernard"}'::jsonb,
    now() - interval '3 months', now() - interval '3 months',
    false
  ),
  (
    'a5000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'theo.petit@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '2 months',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Theo Petit"}'::jsonb,
    now() - interval '2 months', now() - interval '2 months',
    false
  );

-- ─── 2. Enrichissement des profils (auto-créés par le trigger) ────────────────
UPDATE profiles SET
  username     = 'lucas_martin',
  display_name = 'Lucas Martin',
  bio          = 'Passionné de sport cars depuis toujours. BMW, Porsche et tout ce qui tourne vite 🏁',
  city         = 'Lyon',
  tags         = ARRAY['sport', 'track', 'bmw', 'porsche']
WHERE id = 'a1000000-0000-0000-0000-000000000000';

UPDATE profiles SET
  username     = 'sofia_dubois',
  display_name = 'Sofia Dubois',
  bio          = 'Motarde dans l''âme. CBR 600RR sur circuit le weekend, Z900 en balade la semaine.',
  city         = 'Paris',
  tags         = ARRAY['moto', 'circuit', 'roadtrip']
WHERE id = 'a2000000-0000-0000-0000-000000000000';

UPDATE profiles SET
  username     = 'marc_girard',
  display_name = 'Marc Girard',
  bio          = 'Collectionneur et restaurateur de voitures classiques. Chaque véhicule a une histoire.',
  city         = 'Marseille',
  tags         = ARRAY['classic', 'restauration', 'collection']
WHERE id = 'a3000000-0000-0000-0000-000000000000';

UPDATE profiles SET
  username     = 'emma_bernard',
  display_name = 'Emma Bernard',
  bio          = 'Van life & aventure. Mon T4 Westfalia est ma maison depuis 2 ans. Road trip permanent.',
  city         = 'Bordeaux',
  tags         = ARRAY['vanlife', 'roadtrip', 'aventure', 'nature']
WHERE id = 'a4000000-0000-0000-0000-000000000000';

UPDATE profiles SET
  username     = 'theo_petit',
  display_name = 'Theo Petit',
  bio          = 'Enduro le weekend, GR86 en semaine. Addict de la sensation de conduite.',
  city         = 'Toulouse',
  tags         = ARRAY['enduro', 'drift', 'sport', 'offroad']
WHERE id = 'a5000000-0000-0000-0000-000000000000';

-- ─── 3. Véhicules ─────────────────────────────────────────────────────────────

-- Lucas — sport cars
INSERT INTO vehicles (id, owner_id, type, brand, model, year, displacement, power, torque, transmission, weight, description, tags, city, lat, lng, country_code, is_published, created_at)
VALUES
  (
    'b1100000-0000-0000-0000-000000000000',
    'a1000000-0000-0000-0000-000000000000',
    'car', 'BMW', 'M3 E46', 2003,
    '3246 cm³', 343, 365, 'Manuelle 6 rapports', 1495,
    'E46 M3 en configuration CSL quasi-originale. Moteur S54 de 343ch, boîte mécanique 6 rapports. Carrosserie Silber Grau métallisée. Suivi complet BMW depuis la sortie d''usine. Une des dernières vraies M3 à transmission manuelle.',
    ARRAY['bmw', 'm3', 'e46', 'sport', 'allemande', 'classique'],
    'Lyon', 45.7640, 4.8357, 'FR',
    true, now() - interval '5 months'
  ),
  (
    'b1200000-0000-0000-0000-000000000000',
    'a1000000-0000-0000-0000-000000000000',
    'car', 'Porsche', '911 Carrera S (992)', 2022,
    '2981 cm³', 450, 530, 'PDK 8 rapports', 1479,
    'Porsche 911 992 Carrera S en Gentian Blue Metallic. Pack Sport Chrono, PASM, toit ouvrant panoramique. 0-100 en 3,5s. Utilisée principalement sur route ouverte et quelques sorties circuit.',
    ARRAY['porsche', '911', '992', 'sport', 'allemande', 'pdk'],
    'Lyon', 45.7640, 4.8357, 'FR',
    true, now() - interval '3 months'
  ),
  (
    'b1300000-0000-0000-0000-000000000000',
    'a1000000-0000-0000-0000-000000000000',
    'car', 'Renault', 'Clio RS 200 Trophy', 2015,
    '1618 cm³', 220, 260, 'EDC 6 rapports', 1156,
    'Clio 4 RS Trophy 220ch. L''une des 500 exemplaires de la série limitée. Pack Cup avec différentiel mécanique Torsen. Très peu de kilométrages, état proche du neuf. Couleur Flamme.',
    ARRAY['renault', 'clio', 'rs', 'trophy', 'française', 'hot-hatch'],
    'Lyon', 45.7640, 4.8357, 'FR',
    true, now() - interval '1 month'
  ),

  -- Sofia — motos et sport
  (
    'b2100000-0000-0000-0000-000000000000',
    'a2000000-0000-0000-0000-000000000000',
    'moto', 'Honda', 'CBR 600RR', 2007,
    '599 cm³', 120, 66, 'Manuelle 6 rapports', 189,
    'CBR 600RR 2007 préparée circuit. Échappement Akrapovic full system, commandes reculées Sato Racing, pneus Pirelli Supercorsa. Passée au banc : 121ch roue. Utilisée sur Lédenon et Paul Ricard.',
    ARRAY['honda', 'cbr', 'moto', 'circuit', 'superbike', 'akrapovic'],
    'Paris', 48.8566, 2.3522, 'FR',
    true, now() - interval '4 months'
  ),
  (
    'b2200000-0000-0000-0000-000000000000',
    'a2000000-0000-0000-0000-000000000000',
    'moto', 'Kawasaki', 'Z900 RS', 2021,
    '948 cm³', 111, 98, 'Manuelle 6 rapports', 215,
    'Z900 RS dans sa superbe robe Candy Tone Brown & Flat Black. L''hommage parfait à la Z1 des années 70 avec la fiabilité et les performances d''aujourd''hui. Mistral Exhaust 4-en-1, guidons ronds Riser. Ma monture quotidienne.',
    ARRAY['kawasaki', 'z900rs', 'retro', 'neo-classic', 'naked'],
    'Paris', 48.8566, 2.3522, 'FR',
    true, now() - interval '2 months'
  ),
  (
    'b2300000-0000-0000-0000-000000000000',
    'a2000000-0000-0000-0000-000000000000',
    'car', 'Mercedes-AMG', 'C63 S', 2017,
    '3982 cm³', 510, 700, 'Automatique 7 rapports', 1730,
    'C63 S avec le V8 biturbo 510ch. Pakket AMG Performance, freins céramique, toit ouvrant. Noir Obsidienne. Le son de ce moteur est unique. Quelques modifications : carbone sport, scarification des arches, jantes AMG 20''.',
    ARRAY['mercedes', 'amg', 'c63', 'v8', 'sport', 'allemande'],
    'Paris', 48.8566, 2.3522, 'FR',
    true, now() - interval '6 weeks'
  ),

  -- Marc — classiques
  (
    'b3100000-0000-0000-0000-000000000000',
    'a3000000-0000-0000-0000-000000000000',
    'car', 'Volkswagen', 'Golf GTI Mk7', 2016,
    '1984 cm³', 230, 350, 'DSG 6 rapports', 1303,
    'Golf 7 GTI Performance en Blanc Pur. DSG avec les palettes, différentiel électronique, freins GTI Performance. La voiture de tous les jours qui s''assume totalement. Kilométrage maîtrisé, entretien VW scrupuleux.',
    ARRAY['vw', 'golf', 'gti', 'hot-hatch', 'dsg', 'polyvalente'],
    'Marseille', 43.2965, 5.3698, 'FR',
    true, now() - interval '3 months 2 weeks'
  ),
  (
    'b3200000-0000-0000-0000-000000000000',
    'a3000000-0000-0000-0000-000000000000',
    'classic', 'Citroën', 'DS 21 Pallas', 1971,
    '2175 cm³', 109, 175, 'Manuelle 4 rapports', 1270,
    'DS 21 Pallas de 1971, restauration complète sur 3 ans terminée en 2022. Carrosserie refaite en Blanc Meije d''origine, sellerie cuir bordeaux refaite à neuf, suspension hydropneumatique révisée. Une vraie déesse.',
    ARRAY['citroën', 'ds', 'classic', 'restauration', 'française', 'collection'],
    'Marseille', 43.2965, 5.3698, 'FR',
    true, now() - interval '5 months 1 week'
  ),
  (
    'b3300000-0000-0000-0000-000000000000',
    'a3000000-0000-0000-0000-000000000000',
    'classic', 'Triumph', 'Bonneville T120', 2019,
    '1200 cm³', 80, 105, 'Manuelle 6 rapports', 224,
    'Triumph Bonneville T120 dans la finition Black. L''âme britannique de la moto, le caractère du twin parallèle 1200cc, avec la fiabilité moderne. Quelques accessoires Triumph : sacoches cuir, protège-réservoirs, guidons bracelets.',
    ARRAY['triumph', 'bonneville', 'british', 'classic', 'retro', 'twin'],
    'Marseille', 43.2965, 5.3698, 'FR',
    true, now() - interval '2 months 3 weeks'
  ),

  -- Emma — van life
  (
    'b4100000-0000-0000-0000-000000000000',
    'a4000000-0000-0000-0000-000000000000',
    'van', 'Volkswagen', 'T4 Westfalia', 1997,
    '2461 cm³', 102, 195, 'Manuelle 5 rapports', 2100,
    'Mon T4 Westfalia California 1997 entièrement aménagé pour le van life. Isolation renforcée, lit queen-size, mini-cuisine équipée, panneau solaire 200W, batterie lithium 100Ah. Moteur AAB 2.4D refait à neuf. 2 ans de road trip en Europe.',
    ARRAY['vw', 't4', 'westfalia', 'vanlife', 'camping', 'roadtrip', 'aménagé'],
    'Bordeaux', 44.8378, -0.5792, 'FR',
    true, now() - interval '4 months'
  ),

  -- Theo — sport & off-road
  (
    'b5100000-0000-0000-0000-000000000000',
    'a5000000-0000-0000-0000-000000000000',
    'bike', 'KTM', '690 Enduro R', 2022,
    '692 cm³', 74, 73, 'Manuelle 6 rapports', 154,
    'KTM 690 Enduro R 2022, la monomoteur de référence. Préparée enduro : protections Acerbis, guidon Neken, échappement SC-Project, pneumatiques Michelin Enduro. Utilisée sur les sentiers de la forêt des Landes et les Pyrénées.',
    ARRAY['ktm', 'enduro', 'offroad', 'monocylindre', 'moto', 'aventure'],
    'Toulouse', 43.6047, 1.4442, 'FR',
    true, now() - interval '1 month 2 weeks'
  ),
  (
    'b5200000-0000-0000-0000-000000000000',
    'a5000000-0000-0000-0000-000000000000',
    'car', 'Toyota', 'GR86', 2023,
    '2387 cm³', 234, 250, 'Manuelle 6 rapports', 1278,
    'Toyota GR86 2023 en Icy Blue. La transmission manuelle, le moteur boxer 2.4 atmosphérique, la légèreté — c''est tout ce qu''on aime. Préparation légère : échappement Fujitsubo, ressorts Tein, jantes Enkei 17". Sortie drift hebdomadaire.',
    ARRAY['toyota', 'gr86', 'sport', 'rwd', 'drift', 'boxer', 'japonaise'],
    'Toulouse', 43.6047, 1.4442, 'FR',
    true, now() - interval '3 weeks'
  );

-- ─── 4. Photos (storage_path = {ownerId}/{vehicleId}/{index}.jpg) ──────────────
-- Les images ne chargeront pas sans fichiers uploadés dans Supabase Storage.
-- Les chemins suivent la convention de useCreateVehicle.
INSERT INTO vehicle_photos (id, vehicle_id, storage_path, position, is_cover) VALUES
  -- BMW M3 E46
  ('c0000000-0000-0000-0000-000000000001', 'b1100000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1100000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000002', 'b1100000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1100000-0000-0000-0000-000000000000/1.jpg', 1, false),
  ('c0000000-0000-0000-0000-000000000003', 'b1100000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1100000-0000-0000-0000-000000000000/2.jpg', 2, false),
  -- Porsche 911
  ('c0000000-0000-0000-0000-000000000004', 'b1200000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1200000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000005', 'b1200000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1200000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- Clio RS
  ('c0000000-0000-0000-0000-000000000006', 'b1300000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1300000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000007', 'b1300000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000/b1300000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- CBR 600RR
  ('c0000000-0000-0000-0000-000000000008', 'b2100000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2100000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000009', 'b2100000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2100000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- Z900 RS
  ('c0000000-0000-0000-0000-000000000010', 'b2200000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2200000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000011', 'b2200000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2200000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- Mercedes C63
  ('c0000000-0000-0000-0000-000000000012', 'b2300000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2300000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000013', 'b2300000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000/b2300000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- Golf GTI
  ('c0000000-0000-0000-0000-000000000014', 'b3100000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3100000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000015', 'b3100000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3100000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- DS 21 Pallas
  ('c0000000-0000-0000-0000-000000000016', 'b3200000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3200000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000017', 'b3200000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3200000-0000-0000-0000-000000000000/1.jpg', 1, false),
  ('c0000000-0000-0000-0000-000000000018', 'b3200000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3200000-0000-0000-0000-000000000000/2.jpg', 2, false),
  -- Triumph Bonneville
  ('c0000000-0000-0000-0000-000000000019', 'b3300000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3300000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000020', 'b3300000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000/b3300000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- T4 Westfalia
  ('c0000000-0000-0000-0000-000000000021', 'b4100000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000/b4100000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000022', 'b4100000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000/b4100000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- KTM 690
  ('c0000000-0000-0000-0000-000000000023', 'b5100000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000/b5100000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000024', 'b5100000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000/b5100000-0000-0000-0000-000000000000/1.jpg', 1, false),
  -- Toyota GR86
  ('c0000000-0000-0000-0000-000000000025', 'b5200000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000/b5200000-0000-0000-0000-000000000000/0.jpg', 0, true),
  ('c0000000-0000-0000-0000-000000000026', 'b5200000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000/b5200000-0000-0000-0000-000000000000/1.jpg', 1, false);

-- ─── 5. Follows ───────────────────────────────────────────────────────────────
INSERT INTO follows (follower_id, target_id, target_type, created_at) VALUES
  -- Follows de profils
  ('a1000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000', 'profile', now() - interval '5 months'),
  ('a1000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000', 'profile', now() - interval '4 months'),
  ('a2000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000', 'profile', now() - interval '4 months 2 weeks'),
  ('a2000000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000', 'profile', now() - interval '2 months'),
  ('a3000000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000', 'profile', now() - interval '3 months'),
  ('a4000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000', 'profile', now() - interval '2 months 1 week'),
  ('a4000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000', 'profile', now() - interval '3 months'),
  ('a5000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000', 'profile', now() - interval '1 month 3 weeks'),
  ('a5000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000', 'profile', now() - interval '1 month'),
  -- Follows de véhicules
  ('a2000000-0000-0000-0000-000000000000', 'b1100000-0000-0000-0000-000000000000', 'vehicle', now() - interval '4 months 3 weeks'),
  ('a3000000-0000-0000-0000-000000000000', 'b1100000-0000-0000-0000-000000000000', 'vehicle', now() - interval '4 months'),
  ('a5000000-0000-0000-0000-000000000000', 'b1200000-0000-0000-0000-000000000000', 'vehicle', now() - interval '2 months 2 weeks'),
  ('a1000000-0000-0000-0000-000000000000', 'b2100000-0000-0000-0000-000000000000', 'vehicle', now() - interval '3 months 1 week'),
  ('a4000000-0000-0000-0000-000000000000', 'b3200000-0000-0000-0000-000000000000', 'vehicle', now() - interval '4 months 1 week'),
  ('a1000000-0000-0000-0000-000000000000', 'b4100000-0000-0000-0000-000000000000', 'vehicle', now() - interval '3 months'),
  ('a2000000-0000-0000-0000-000000000000', 'b4100000-0000-0000-0000-000000000000', 'vehicle', now() - interval '2 months 3 weeks'),
  ('a3000000-0000-0000-0000-000000000000', 'b5200000-0000-0000-0000-000000000000', 'vehicle', now() - interval '3 weeks');

-- ─── 6. Commentaires ──────────────────────────────────────────────────────────
INSERT INTO comments (id, vehicle_id, user_id, body, created_at) VALUES
  -- Sur la BMW M3 E46
  ('e0000000-0000-0000-0000-000000000001', 'b1100000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000',
   'Une E46 M3 en état aussi propre c''est rare... Le S54 en configuration CSL c''est le summum. Tu pistes avec ?',
   now() - interval '4 months 3 weeks'),
  ('e0000000-0000-0000-0000-000000000002', 'b1100000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000',
   'Magnifique ! J''ai toujours rêvé de conduire une E46 M3. C''est quoi le ressenti par rapport à une voiture moderne ?',
   now() - interval '4 months 1 week'),
  ('e0000000-0000-0000-0000-000000000003', 'b1100000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000',
   'Belle pièce de collection en devenir. Dans 10 ans elle va encore prendre de la valeur.',
   now() - interval '3 months 2 weeks'),

  -- Sur la DS 21 Pallas
  ('e0000000-0000-0000-0000-000000000004', 'b3200000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000',
   'Quel travail de restauration... La sellerie cuir bordeaux avec le Blanc Meije c''est une combinaison parfaite.',
   now() - interval '4 months'),
  ('e0000000-0000-0000-0000-000000000005', 'b3200000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000',
   'La suspension hydropneumatique sur ces vieilles DS c''est toujours aussi magique. Félicitations pour la restauration !',
   now() - interval '3 months 3 weeks'),

  -- Sur le T4 Westfalia
  ('e0000000-0000-0000-0000-000000000006', 'b4100000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000',
   '2 ans de van life plein temps c''est impressionnant. Tu as fait combien de pays ?',
   now() - interval '3 months 1 week'),
  ('e0000000-0000-0000-0000-000000000007', 'b4100000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000',
   'L''aménagement avec le panneau solaire et la batterie lithium c''est le setup parfait. Tu es passée à quoi comme frigo ?',
   now() - interval '2 months 2 weeks'),

  -- Sur la Porsche 911
  ('e0000000-0000-0000-0000-000000000008', 'b1200000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000',
   'Le Gentian Blue sur la 992 c''est probablement le coloris le plus réussi de la gamme. Belle machine !',
   now() - interval '2 months 3 weeks'),
  ('e0000000-0000-0000-0000-000000000009', 'b1200000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000000',
   'Le PDK sur les Porsche modernes c''est vraiment impressionnant. Tu l''utilises en mode manuel sur circuit ?',
   now() - interval '2 months'),

  -- Sur le GR86
  ('e0000000-0000-0000-0000-000000000010', 'b5200000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000',
   'Le GR86 c''est la dernière vraie voiture fun accessible. Pas de turbo, pas d''électronique intrusive, juste du plaisir. Bon choix !',
   now() - interval '2 weeks'),
  ('e0000000-0000-0000-0000-000000000011', 'b5200000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000',
   'Icy Blue sur le GR86 c''est tellement beau. Tu la sors souvent en drift ?',
   now() - interval '1 week 2 days');

-- ─── 7. Likes ─────────────────────────────────────────────────────────────────
INSERT INTO likes (id, target_id, target_type, user_id, created_at) VALUES
  -- Likes véhicule — BMW M3 E46
  ('f0000000-0000-0000-0000-000000000001', 'b1100000-0000-0000-0000-000000000000', 'vehicle', 'a2000000-0000-0000-0000-000000000000', now() - interval '4 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000002', 'b1100000-0000-0000-0000-000000000000', 'vehicle', 'a3000000-0000-0000-0000-000000000000', now() - interval '4 months 1 week'),
  ('f0000000-0000-0000-0000-000000000003', 'b1100000-0000-0000-0000-000000000000', 'vehicle', 'a4000000-0000-0000-0000-000000000000', now() - interval '3 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000004', 'b1100000-0000-0000-0000-000000000000', 'vehicle', 'a5000000-0000-0000-0000-000000000000', now() - interval '3 months 2 weeks'),
  -- Porsche 911
  ('f0000000-0000-0000-0000-000000000005', 'b1200000-0000-0000-0000-000000000000', 'vehicle', 'a2000000-0000-0000-0000-000000000000', now() - interval '2 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000006', 'b1200000-0000-0000-0000-000000000000', 'vehicle', 'a3000000-0000-0000-0000-000000000000', now() - interval '2 months 2 weeks'),
  ('f0000000-0000-0000-0000-000000000007', 'b1200000-0000-0000-0000-000000000000', 'vehicle', 'a5000000-0000-0000-0000-000000000000', now() - interval '2 months'),
  -- CBR 600RR
  ('f0000000-0000-0000-0000-000000000008', 'b2100000-0000-0000-0000-000000000000', 'vehicle', 'a1000000-0000-0000-0000-000000000000', now() - interval '3 months 1 week'),
  ('f0000000-0000-0000-0000-000000000009', 'b2100000-0000-0000-0000-000000000000', 'vehicle', 'a5000000-0000-0000-0000-000000000000', now() - interval '3 months'),
  -- DS 21 Pallas
  ('f0000000-0000-0000-0000-000000000010', 'b3200000-0000-0000-0000-000000000000', 'vehicle', 'a1000000-0000-0000-0000-000000000000', now() - interval '4 months 2 weeks'),
  ('f0000000-0000-0000-0000-000000000011', 'b3200000-0000-0000-0000-000000000000', 'vehicle', 'a2000000-0000-0000-0000-000000000000', now() - interval '4 months'),
  ('f0000000-0000-0000-0000-000000000012', 'b3200000-0000-0000-0000-000000000000', 'vehicle', 'a4000000-0000-0000-0000-000000000000', now() - interval '3 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000013', 'b3200000-0000-0000-0000-000000000000', 'vehicle', 'a5000000-0000-0000-0000-000000000000', now() - interval '3 months'),
  -- T4 Westfalia
  ('f0000000-0000-0000-0000-000000000014', 'b4100000-0000-0000-0000-000000000000', 'vehicle', 'a1000000-0000-0000-0000-000000000000', now() - interval '3 months'),
  ('f0000000-0000-0000-0000-000000000015', 'b4100000-0000-0000-0000-000000000000', 'vehicle', 'a2000000-0000-0000-0000-000000000000', now() - interval '2 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000016', 'b4100000-0000-0000-0000-000000000000', 'vehicle', 'a3000000-0000-0000-0000-000000000000', now() - interval '2 months 1 week'),
  ('f0000000-0000-0000-0000-000000000017', 'b4100000-0000-0000-0000-000000000000', 'vehicle', 'a5000000-0000-0000-0000-000000000000', now() - interval '1 month 3 weeks'),
  -- GR86
  ('f0000000-0000-0000-0000-000000000018', 'b5200000-0000-0000-0000-000000000000', 'vehicle', 'a1000000-0000-0000-0000-000000000000', now() - interval '2 weeks'),
  ('f0000000-0000-0000-0000-000000000019', 'b5200000-0000-0000-0000-000000000000', 'vehicle', 'a2000000-0000-0000-0000-000000000000', now() - interval '2 weeks'),
  ('f0000000-0000-0000-0000-000000000020', 'b5200000-0000-0000-0000-000000000000', 'vehicle', 'a3000000-0000-0000-0000-000000000000', now() - interval '1 week 3 days'),
  -- Likes sur commentaires
  ('f0000000-0000-0000-0000-000000000021', 'e0000000-0000-0000-0000-000000000001', 'comment', 'a1000000-0000-0000-0000-000000000000', now() - interval '4 months 2 weeks'),
  ('f0000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000004', 'comment', 'a3000000-0000-0000-0000-000000000000', now() - interval '3 months 3 weeks'),
  ('f0000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000008', 'comment', 'a1000000-0000-0000-0000-000000000000', now() - interval '2 months 2 weeks'),
  ('f0000000-0000-0000-0000-000000000024', 'e0000000-0000-0000-0000-000000000010', 'comment', 'a5000000-0000-0000-0000-000000000000', now() - interval '1 week');

-- ─── 8. Conversations & messages ──────────────────────────────────────────────
INSERT INTO conversations (id, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', now() - interval '3 months'),
  ('d0000000-0000-0000-0000-000000000002', now() - interval '1 month');

INSERT INTO conversation_participants (conversation_id, profile_id) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000000'),
  ('d0000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000000'),
  ('d0000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000000'),
  ('d0000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000000');

INSERT INTO messages (id, conversation_id, sender_id, content, created_at) VALUES
  -- Lucas ↔ Sofia
  ('00000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000000',
   'Salut Lucas ! Belle E46, tu la sors sur quel circuit en général ?',
   now() - interval '3 months'),
  ('00000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000000',
   'Merci ! Je vais surtout sur Lédenon et Pont l''Abbé. Et toi avec ta CBR ?',
   now() - interval '2 months 3 weeks'),
  ('00000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000000',
   'Pareil Lédenon ! On devrait s''organiser une sortie commune, ça serait sympa.',
   now() - interval '2 months 2 weeks'),
  ('00000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000000',
   'Bonne idée ! Je regarde les dates et je te tiens au courant.',
   now() - interval '2 months 2 weeks'),
  -- Marc ↔ Emma
  ('00000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000000',
   'Emma, belle restauration du T4 ! Tu es passée par quel atelier pour le moteur ?',
   now() - interval '1 month'),
  ('00000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000000',
   'Merci Marc ! J''ai tout fait moi-même en fait. 6 mois de boulot. Le AAB 2.4D c''est costaud, bien documenté aussi.',
   now() - interval '3 weeks 4 days'),
  ('00000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000000',
   'Impressionnant ! Si tu cherches des pièces pour les classiques un jour, je connais quelques bons fournisseurs.',
   now() - interval '3 weeks');
