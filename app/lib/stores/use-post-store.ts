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
  setPhotos: (photos: string[]) => void;
  setType: (type: string) => void;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
  setYear: (year: number | null) => void;
  setDisplacement: (displacement: string) => void;
  setPower: (power: number | null) => void;
  setDescription: (description: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setCity: (city: string) => void;
  setPrecise: (precise: boolean) => void;
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
  setPhotos: (photos) => set({ photos }),
  setType: (type) => set({ type }),
  setBrand: (brand) => set({ brand }),
  setModel: (model) => set({ model }),
  setYear: (year) => set({ year }),
  setDisplacement: (displacement) => set({ displacement }),
  setPower: (power) => set({ power }),
  setDescription: (description) => set({ description }),
  addTag: (tag) =>
    set((s) => ({ tags: s.tags.includes(tag) ? s.tags : [...s.tags, tag] })),
  removeTag: (tag) =>
    set((s) => ({ tags: s.tags.filter((t) => t !== tag) })),
  setCity: (city) => set({ city }),
  setPrecise: (precise) => set({ precise }),
  reset: () => set(INITIAL_STATE),
}));
