-- Migration 003: Chat & messagerie temps réel
-- conversations → conversation_participants (n-n) → messages

CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE conversation_participants (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, profile_id)
);
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         text,
  image_url       text,
  created_at      timestamptz DEFAULT now(),
  CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
