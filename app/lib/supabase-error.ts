import { PostgrestError } from "@supabase/supabase-js";

const ERROR_MESSAGES: Record<string, string> = {
  "42501": "Permission refusée.",
  "23505": "Cette entrée existe déjà.",
  "23503": "Référence invalide.",
  PGRST116: "Ressource introuvable.",
  PGRST301: "Session expirée. Reconnecte-toi.",
};

export function handleSupabaseError(error: PostgrestError): string {
  return (
    ERROR_MESSAGES[error.code] ?? "Une erreur est survenue. Réessaie plus tard."
  );
}
