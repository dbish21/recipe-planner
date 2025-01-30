import { 
    doc, 
    getDoc, 
    setDoc, 
    deleteDoc, 
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { Recipe } from '../types/Recipe';
  import { getRecipeById } from './recipeService';
  
  const FAVORITES_COLLECTION = 'favorites';
  
  export async function addFavorite(userId: string, recipe: Recipe): Promise<void> {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipe.id}`);
    await setDoc(favoriteRef, {
      userId,
      recipeId: recipe.id,
      dateAdded: new Date().toISOString(),
      recipe
    });
  }
  
  export async function removeFavorite(userId: string, recipeId: number): Promise<void> {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    await deleteDoc(favoriteRef);
  }
  
  export async function getFavorites(userId: string): Promise<Recipe[]> {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const recipes: Recipe[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (data.recipe) {
        recipes.push(data.recipe as Recipe);
      } else if (data.recipeId) {
        try {
          const recipe = await getRecipeById(data.recipeId);
          if (recipe) {
            recipes.push(recipe);
          }
        } catch (error) {
          console.error(`Failed to fetch recipe ${data.recipeId}:`, error);
        }
      }
    }
    
    return recipes;
  }
  
  export async function isFavorite(userId: string, recipeId: number): Promise<boolean> {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  }
  
  export async function getFavoriteRecipes(userId: string): Promise<number[]> {
    try {
      const docRef = doc(db, FAVORITES_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().recipeIds || [];
      } else {
        // Create document if it doesn't exist
        await setDoc(docRef, { recipeIds: [] });
        return [];
      }
    } catch (error) {
      console.error('Error getting favorite recipes:', error);
      throw error;
    }
  }
  
  export async function addFavoriteRecipe(userId: string, recipeId: number): Promise<void> {
    try {
      const docRef = doc(db, FAVORITES_COLLECTION, userId);
      await updateDoc(docRef, {
        recipeIds: arrayUnion(recipeId)
      });
    } catch (error) {
      // If document doesn't exist, create it
      if ((error as any).code === 'not-found') {
        const docRef = doc(db, FAVORITES_COLLECTION, userId);
        await setDoc(docRef, {
          recipeIds: [recipeId]
        });
      } else {
        console.error('Error adding favorite recipe:', error);
        throw error;
      }
    }
  }
  
  export async function removeFavoriteRecipe(userId: string, recipeId: number): Promise<void> {
    try {
      const docRef = doc(db, FAVORITES_COLLECTION, userId);
      await updateDoc(docRef, {
        recipeIds: arrayRemove(recipeId)
      });
    } catch (error) {
      console.error('Error removing favorite recipe:', error);
      throw error;
    }
  }
  
  export async function isFavoriteRecipe(userId: string, recipeId: number): Promise<boolean> {
    try {
      const favorites = await getFavoriteRecipes(userId);
      return favorites.includes(recipeId);
    } catch (error) {
      console.error('Error checking favorite recipe:', error);
      throw error;
    }
  }