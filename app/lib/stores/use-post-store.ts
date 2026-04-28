import { create } from "zustand";

interface PostStore {
  // Étape 1 — Photos
  photos: string[];
  // Étape 2 — Type de véhicule
  type: string;
  brand: string;
  model: string;
  year: number | null;
  displacement: string;
  power: number | null;
  // Étape 3 — Description & tags
  description: string;
  tags: string[];
  // Étape 4 — Localisation
  city: string;
  precise: boolean;
  // Actions
  reset: () => void;
}

const INITIAL_STATE = {
  photos: [],
  type: "",
  brand: "",
  model: "",
  year: null,
  displacement: "",
  power: null,
  description: "",
  tags: [],
  city: "",
  precise: false,
};

export const usePostStore = create<PostStore>((set) => ({
  ...INITIAL_STATE,
  reset: () => set(INITIAL_STATE),
}));
