import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoriteService';

interface FavoritesContextType {
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => Promise<void>;
  removeFromFavorites: (recipeId: number) => Promise<void>;
  isFavorite: (recipeId: number) => boolean;
  loading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadFavorites();
  }, [currentUser]);

  const isFavorite = (recipeId: number) => {
    return favorites.some(recipe => recipe.id === recipeId);
  };

  const addToFavorites = async (recipe: Recipe) => {
    if (!currentUser) return;
    try {
      await addFavorite(currentUser.uid, recipe);
      setFavorites(prev => [...prev, recipe]);
    } catch (err) {
      setError('Failed to add favorite');
      console.error(err);
    }
  };

  const removeFromFavorites = async (recipeId: number) => {
    if (!currentUser) return;
    try {
      await removeFavorite(currentUser.uid, recipeId);
      setFavorites(prev => prev.filter(recipe => recipe.id === recipeId));
    } catch (err) {
      setError('Failed to remove favorite');
      console.error(err);
    }
  };

  const loadFavorites = async () => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const userFavorites = await getFavorites(currentUser.uid);
      setFavorites(userFavorites);
      setError(null);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading,
    error
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};