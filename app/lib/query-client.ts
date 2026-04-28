import { QueryClient } from "@tanstack/react-query";

// Singleton partagé dans toute l'app — staleTime 5 min par défaut
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
