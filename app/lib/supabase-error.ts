import { AuthError, PostgrestError } from "@supabase/supabase-js";

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

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email ou mot de passe incorrect.",
  "Email not confirmed": "Vérifie ton email pour confirmer ton compte.",
  "User already registered": "Ce compte existe déjà.",
  "Email rate limit exceeded": "Trop de tentatives. Réessaie dans quelques minutes.",
  "Signup requires a valid password": "Mot de passe invalide.",
};

export function handleAuthError(error: AuthError): string {
  return (
    AUTH_ERROR_MESSAGES[error.message] ?? "Une erreur est survenue. Réessaie plus tard."
  );
}
