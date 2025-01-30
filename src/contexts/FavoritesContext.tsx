import React, { createContext, useContext, useState, useCallback } from 'react';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = useCallback((recipeId: number) => {
    setFavorites(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  }, []);

  const isFavorite = useCallback((recipeId: number) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 