import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { PokemonSummary } from '../types/pokemon';

type FavoritesContextValue = {
  favorites: PokemonSummary[];
  toggleFavorite: (pokemon: PokemonSummary) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<PokemonSummary[]>([]);

  const toggleFavorite = (pokemon: PokemonSummary) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((item) => item.id === pokemon.id);

      if (isAlreadyFavorite) {
        return prev.filter((item) => item.id !== pokemon.id);
      }

      return [...prev, pokemon];
    });
  };

  const isFavorite = (id: number) => favorites.some((pokemon) => pokemon.id === id);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider.');
  }

  return context;
};

