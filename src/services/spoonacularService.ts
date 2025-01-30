import axios from 'axios';
import { Recipe, Ingredient, NutritionInfo } from '../types/Recipe';
import { SetStateAction } from 'react';

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

const headers = {
  headers: {
    'X-RapidAPI-Key': API_KEY || '',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
  }
};

interface SpoonacularIngredient {
  aisle: string;
  id: number;
  name: string;
  amount: number;
  unit: string;
  originalName?: string;
  meta?: string[];
  image?: string;
}

interface SpoonacularInstruction {
  number: number;
  step: string;
  ingredients?: SpoonacularIngredient[];
  equipment?: any[];
}

interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
}

interface SpoonacularRecipeBase {
  dishTypes: never[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  id: number;
  title: string;
  summary: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  preparationMinutes?: number;
  cookingMinutes?: number;
  extendedIngredients: SpoonacularIngredient[];
  analyzedInstructions: { steps: { step: string }[] }[];
  instructions?: string | string[] | ((instructions: any) => string);
  cuisines: string[];
  diets: string[];
  pricePerServing: number;
  nutrition: {
    nutrients: SpoonacularNutrient[];
  };
}

interface SpoonacularSearchResult extends SpoonacularRecipeBase {
  // Additional fields specific to search results
}

interface SpoonacularRecipeDetail extends SpoonacularRecipeBase {
  // Additional fields specific to recipe details
}

const transformIngredients = (ingredients: SpoonacularIngredient[]): Ingredient[] => {
  return ingredients.map(ingredient => ({
    id: ingredient.id,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    category: 'other',
    price: 0,
    imageUrl: ingredient.image,
    original: ingredient.originalName || `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
  }));
};

const extractInstructions = (instructions: { steps: SpoonacularInstruction[] }[]): string[] => {
  if (!instructions || instructions.length === 0) return [];
  return instructions[0].steps.map((step: SpoonacularInstruction) => step.step);
};

const calculateTotalCost = (ingredients: SpoonacularIngredient[]): number => {
  return ingredients.length * 2; // Placeholder calculation
};

const findNutrientAmount = (nutrients: SpoonacularNutrient[], name: string): number => {
  return nutrients.find(n => n.name === name)?.amount || 0;
};

const transformSpoonacularRecipe = (apiRecipe: any): Recipe => {
  if (!apiRecipe) {
    throw new Error('No recipe data provided to transform');
  }

  const recipe: Recipe = {
    id: apiRecipe.id || 0,
    title: apiRecipe.title || 'Untitled Recipe',
    image: apiRecipe.image || '',
    readyInMinutes: apiRecipe.readyInMinutes || 0,
    servings: apiRecipe.servings || 1,
    pricePerServing: apiRecipe.pricePerServing || 0,
    summary: apiRecipe.summary || '',
    instructions: apiRecipe.instructions || '',
    extendedIngredients: Array.isArray(apiRecipe.extendedIngredients) 
      ? apiRecipe.extendedIngredients.map((ing: any) => ({
          id: ing.id || 0,
          name: ing.name || '',
          amount: ing.amount || 0,
          unit: ing.unit || '',
          original: ing.original || '',
          originalName: ing.originalName || '',
          meta: ing.meta || [],
          image: ing.image || '',
          imageUrl: ing.imageUrl || '',
          price: ing.price || 0,
          aisle: ing.aisle || '',
          consistency: ing.consistency || '',
          category: ing.category || ''
        }))
      : [],
    vegetarian: apiRecipe.vegetarian || false,
    vegan: apiRecipe.vegan || false,
    glutenFree: apiRecipe.glutenFree || false,
    dairyFree: apiRecipe.dairyFree || false,
    veryHealthy: apiRecipe.veryHealthy || false,
    cheap: apiRecipe.cheap || false,
    veryPopular: apiRecipe.veryPopular || false,
    sustainable: apiRecipe.sustainable || false,
    cuisines: apiRecipe.cuisines || [],
    diets: apiRecipe.diets || [],
    dishTypes: apiRecipe.dishTypes || [],
    nutrition: apiRecipe.nutrition ? {
      nutrients: (apiRecipe.nutrition.nutrients || []).map((n: any) => ({
        name: n.name || '',
        amount: n.amount || 0,
        unit: n.unit || ''
      })),
      healthLabels: apiRecipe.nutrition.healthLabels || []
    } : undefined
  };

  return recipe;
};

const mapApiRecipeToRecipe = (data: SpoonacularRecipeBase): Recipe => {
  return {
    id: typeof data.id === 'string' ? parseInt(data.id) : data.id,
    title: data.title,
    summary: data.summary || '',
    image: data.image,
    servings: data.servings,
    readyInMinutes: data.readyInMinutes || 0,
    instructions: typeof data.instructions === 'string' ? data.instructions : '',
    extendedIngredients: (data.extendedIngredients || []).map(ing => ({
      id: typeof ing.id === 'string' ? parseInt(ing.id) : ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      original: ing.originalName || `${ing.amount} ${ing.unit} ${ing.name}`,
      price: 0,
      imageUrl: ing.image,
      category: ing.aisle || ''
    })),
    pricePerServing: data.pricePerServing || 0,
    diets: data.diets || [],
    cuisines: data.cuisines || [],
    dishTypes: data.dishTypes || [],
    nutrition: data.nutrition ? {
      nutrients: (data.nutrition.nutrients || []).map(n => ({
        name: n.name,
        amount: n.amount,
        unit: n.unit
      })),
      healthLabels: []
    } : undefined,
    vegetarian: data.vegetarian || false,
    vegan: data.vegan || false,
    glutenFree: data.glutenFree || false,
    dairyFree: data.dairyFree || false,
    veryHealthy: data.veryHealthy || false,
    cheap: data.cheap || false,
    veryPopular: data.veryPopular || false,
    sustainable: data.sustainable || false
  };
};

function parseInstructions(instructions: any): string {
  if (!instructions) return '';
  if (typeof instructions === 'string') return instructions;
  if (Array.isArray(instructions)) return instructions.join('\n');
  return '';
}

function mapIngredient(ing: any): Ingredient {
  return {
    id: typeof ing.id === 'string' ? parseInt(ing.id) : (ing.id || 0),
    name: ing.name || '',
    amount: ing.amount || 0,
    unit: ing.unit || '',
    original: ing.original || `${ing.amount || 0} ${ing.unit || ''} ${ing.name || ''}`,
    price: ing.price || 0,
    imageUrl: ing.image,
    category: ing.aisle
  };
}

function mapRecipe(recipe: any): Recipe {
  return {
    id: typeof recipe.id === 'string' ? parseInt(recipe.id) : (recipe.id || 0),
    title: recipe.title || '',
    image: recipe.image || '',
    readyInMinutes: recipe.readyInMinutes || 0,
    servings: recipe.servings || 1,
    summary: recipe.summary || '',
    instructions: Array.isArray(recipe.instructions) 
      ? recipe.instructions.join('\n') 
      : (recipe.instructions || ''),
    extendedIngredients: (recipe.extendedIngredients || []).map((ing: any) => ({
      id: typeof ing.id === 'string' ? parseInt(ing.id) : (ing.id || 0),
      name: ing.name || '',
      amount: ing.amount || 0,
      unit: ing.unit || '',
      original: ing.original || `${ing.amount || 0} ${ing.unit || ''} ${ing.name || ''}`,
      price: ing.price || 0,
      imageUrl: ing.image,
      category: ing.aisle || ''
    })),
    pricePerServing: recipe.pricePerServing || 0,
    diets: recipe.diets || [],
    cuisines: recipe.cuisines || [],
    dishTypes: recipe.dishTypes || [],
    nutrition: recipe.nutrition ? {
      nutrients: (recipe.nutrition.nutrients || []).map((nutrient: any) => ({
        name: nutrient.name || '',
        amount: nutrient.amount || 0,
        unit: nutrient.unit || ''
      })),
      healthLabels: recipe.nutrition.healthLabels || []
    } : undefined,
    vegetarian: recipe.vegetarian || false,
    vegan: recipe.vegan || false,
    glutenFree: recipe.glutenFree || false,
    dairyFree: recipe.dairyFree || false,
    veryHealthy: recipe.veryHealthy || false,
    cheap: recipe.cheap || false,
    veryPopular: recipe.veryPopular || false,
    sustainable: recipe.sustainable || false
  };
}

interface SpoonacularResponse {
  recipes: SetStateAction<Recipe[]>;
  results: any[];
  totalResults: number;
  number: number;
  offset: number;
}

export const getRecipeById = async (id: number): Promise<Recipe | null> => {
  if (!id || isNaN(id)) {
    console.error('Invalid recipe ID:', id);
    return null;
  }

  try {
    const url = `${BASE_URL}/recipes/${id}/information`;
    console.log('Fetching recipe from:', url); // Debug log
    
    const response = await axios.get<SpoonacularRecipeDetail>(url, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });
    
    if (!response.data) {
      console.error('No data received for recipe:', id);
      return null;
    }

    return transformSpoonacularRecipe(response.data);
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    return null;
  }
};

export const searchRecipes = async (
  query: string,
  page: number = 1,
  pageSize: number = 9
): Promise<{ recipes: Recipe[]; totalResults: number }> => {
  try {
    const offset = (page - 1) * pageSize;
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: query,
        number: pageSize,
        offset: offset,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });

    if (!response.data || !response.data.results) {
      return { recipes: [], totalResults: 0 };
    }

    const recipes = response.data.results
      .map((recipe: any) => {
        try {
          return transformSpoonacularRecipe(recipe);
        } catch (error) {
          console.error('Error transforming recipe:', error);
          return null;
        }
      })
      .filter((recipe: Recipe | null): recipe is Recipe => recipe !== null);

    return {
      recipes,
      totalResults: response.data.totalResults || 0
    };
  } catch (error) {
    console.error('Error searching recipes:', error);
    return { recipes: [], totalResults: 0 };
  }
};

export async function searchIngredients(query: string): Promise<Ingredient[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/food/ingredients/search?query=${query}`,
      headers
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.results.map((ing: any): Ingredient => ({
      id: typeof ing.id === 'string' ? parseInt(ing.id) : (ing.id || 0),
      name: ing.name || '',
      amount: 0,
      unit: '',
      original: ing.name || '',
      price: 0,
      imageUrl: ing.image,
      category: ing.aisle || ''
    }));
  } catch (error) {
    console.error('Error searching ingredients:', error);
    throw error;
  }
}

export async function getRandomRecipes(number: number = 10): Promise<Recipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/random?number=${number}`,
      headers
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.recipes.map(mapRecipe);
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
}

export const getRecipeDetails = async (recipeId: string): Promise<Recipe> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`
    );
    const data: SpoonacularRecipeDetail = await response.json();
    return transformSpoonacularRecipe(data);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

const getMockRecipe = (id: string): Recipe => ({
  id: parseInt(id),
  title: 'Sample Recipe',
  summary: 'A delicious sample recipe for testing purposes.',
  image: 'https://spoonacular.com/recipeImages/default-recipe.jpg',
  servings: 4,
  readyInMinutes: 45,
  instructions: 'Cook pasta\nAdd cheese\nServe',
  extendedIngredients: [
    {
      id: 1,
      name: 'Pasta',
      amount: 16,
      unit: 'ounces',
      original: '16 ounces pasta',
      price: 0,
      imageUrl: '',
      category: 'Pasta'
    }
  ],
  diets: ['vegetarian'],
  cuisines: ['Italian'],
  dishTypes: [],
  pricePerServing: 2.50,
  nutrition: {
    nutrients: [
      { name: 'Protein', amount: 12, unit: 'g' },
      { name: 'Fat', amount: 8, unit: 'g' },
      { name: 'Carbohydrates', amount: 65, unit: 'g' }
    ],
    healthLabels: []
  },
  vegetarian: true,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  veryHealthy: false,
  cheap: true,
  veryPopular: false,
  sustainable: false
});

const categorizeIngredient = (aisle: string): string => {
  const categories: { [key: string]: string[] } = {
    'Produce': ['Produce', 'Fresh Vegetables', 'Fresh Fruits'],
    'Meat': ['Meat', 'Seafood'],
    'Dairy': ['Dairy', 'Cheese', 'Milk, Eggs, Other Dairy'],
    'Pantry': ['Canned and Jarred', 'Pasta and Rice', 'Baking'],
    'Spices': ['Spices and Seasonings'],
    'Frozen': ['Frozen'],
    'Other': ['Other']
  };

  for (const [category, aisles] of Object.entries(categories)) {
    if (aisles.some(a => aisle.includes(a))) {
      return category;
    }
  }
  return 'Other';
};

export const getRecipeIngredients = async (recipeId: string): Promise<Ingredient[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${recipeId}/ingredientWidget.json`,
      {
        params: {
          apiKey: API_KEY,
        },
      }
    );

    return response.data.ingredients.map((ing: any) => ({
      id: ing.id || Math.random(),
      name: ing.name,
      amount: ing.amount.metric.value,
      unit: ing.amount.metric.unit,
      price: 0,
      imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`,
    }));
  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    return [];
  }
};

export const getRecipeWithIngredients = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const [recipeResponse, ingredientsResponse] = await Promise.all([
      getRecipeById(parseInt(recipeId)),
      getRecipeIngredients(recipeId),
    ]);

    if (!recipeResponse) return null;

    return {
      ...recipeResponse,
      extendedIngredients: ingredientsResponse,
      pricePerServing: recipeResponse.pricePerServing || 0
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export async function analyzeMealPlan(recipes: Recipe[]): Promise<{
  nutrients: { name: string; amount: number; unit: string }[];
  cost: number;
}> {
  return {
    nutrients: recipes.flatMap(recipe => 
      recipe.nutrition?.nutrients || []
    ),
    cost: recipes.reduce((total, recipe) => 
      total + (recipe.pricePerServing * recipe.servings), 0
    )
  };
}
