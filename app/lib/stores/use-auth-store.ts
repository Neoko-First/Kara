import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

interface AuthStore {
  session: Session | null;
  user: User | null;
  // true au démarrage — permet au routing guard (Story 1.4) de distinguer
  // "session non vérifiée" de "pas de session"
  loading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  loading: true,
  setSession: (session) =>
    set({ session, user: session?.user ?? null, loading: false }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },
}));
