// Store favorites in localStorage
const STORAGE_KEY = 'recipe_favorites';

// Only store IDs in localStorage
const getFavoriteIds = (): number[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // If we have an array of objects, extract just the IDs
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'number') return item;
        if (typeof item === 'object' && item !== null && 'id' in item) {
          return Number(item.id);
        }
        return NaN;
      }).filter(id => !isNaN(id));
    }
    return [];
  } catch (error) {
    console.error('Error parsing favorites:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favoriteIds: number[]) => {
  try {
    // Ensure we're only storing an array of numbers
    const cleanIds = favoriteIds
      .map(id => Number(id))
      .filter(id => !isNaN(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanIds));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const saveFavorite = (recipeId: number) => {
  const favoriteIds = getFavoriteIds();
  if (!favoriteIds.includes(recipeId)) {
    favoriteIds.push(recipeId);
    saveFavoritesToStorage(favoriteIds);
  }
};

export const removeFavorite = (recipeId: number) => {
  const favoriteIds = getFavoriteIds();
  const updatedFavorites = favoriteIds.filter(id => id !== recipeId);
  saveFavoritesToStorage(updatedFavorites);
};

export const getFavorites = (): number[] => {
  return getFavoriteIds();
};

export const isFavorite = (recipeId: number): boolean => {
  const favoriteIds = getFavoriteIds();
  return favoriteIds.includes(recipeId);
};

export const getAllFavorites = (): number[] => {
  return getFavorites();
};