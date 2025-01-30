import { Recipe, NutritionInfo, Ingredient } from '../types/Recipe';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Using a different API key
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

const API_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

const headers = {
  headers: {
    'X-RapidAPI-Key': API_KEY || '',
    'X-RapidAPI-Host': API_HOST
  }
};

// Utility functions
const generateId = (): string => {
  return uuidv4();
};

const calculateTotalCost = (ingredients: Ingredient[]): number => {
  return ingredients.reduce((total, ingredient) => {
    return total + (ingredient.price || 0);
  }, 0);
};

const calculateCostPerServing = (ingredients: Ingredient[], servings: number): number => {
  const totalCost = calculateTotalCost(ingredients);
  return servings > 0 ? totalCost / servings : 0;
};

const transformRecipeResponse = (recipeData: any): Recipe => {
  return {
    id: recipeData.id,
    title: recipeData.title,
    summary: recipeData.summary || '',
    image: recipeData.image || '',
    servings: recipeData.servings || 4,
    readyInMinutes: recipeData.readyInMinutes || 0,
    extendedIngredients: recipeData.extendedIngredients?.map((ing: any) => ({
      id: ing.id || Math.random(),
      name: ing.name || '',
      amount: ing.amount || 0,
      unit: ing.unit || '',
      price: 0,
      original: ing.original || '',
      imageUrl: ing.image || ''
    })) || [],
    instructions: Array.isArray(recipeData.instructions) 
      ? recipeData.instructions.join('\n') 
      : (recipeData.instructions || ''),
    pricePerServing: recipeData.pricePerServing || 0,
    diets: recipeData.diets || [],
    cuisines: recipeData.cuisines || [],
    dishTypes: recipeData.dishTypes || [],
    totalCost: (recipeData.pricePerServing || 0) * (recipeData.servings || 4),
    preparationMinutes: recipeData.preparationMinutes || 0,
    nutrition: recipeData.nutrition ? {
      nutrients: recipeData.nutrition.nutrients || [],
      healthLabels: recipeData.nutrition.healthLabels || []
    } : undefined,
    vegetarian: recipeData.vegetarian || false,
    vegan: recipeData.vegan || false,
    glutenFree: recipeData.glutenFree || false,
    dairyFree: recipeData.dairyFree || false,
    veryHealthy: recipeData.veryHealthy || false,
    cheap: recipeData.cheap || false,
    veryPopular: recipeData.veryPopular || false,
    sustainable: recipeData.sustainable || false
  };
};

export const getRecipeWithIngredients = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const recipeResponse = await axios.get(
      `${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`
    );
    const ingredientsResponse = await getIngredients(recipeId);
    const recipe = recipeResponse.data;
    
    return transformRecipeResponse(recipe);
  } catch (error) {
    console.error('Error fetching recipe with ingredients:', error);
    return null;
  }
};

export const getRecipeDetails = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`
    );
    return transformRecipeResponse(response.data);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

// Mock data for testing
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    servings: 4,
    readyInMinutes: 30,
    pricePerServing: 2.5,
    extendedIngredients: [
      { id: 1, name: "Spaghetti", amount: 1, unit: "pound", original: "1 pound spaghetti" },
      { id: 2, name: "Eggs", amount: 4, unit: "large", original: "4 large eggs" },
      { id: 3, name: "Pecorino Romano", amount: 1, unit: "cup", original: "1 cup grated Pecorino Romano" },
      { id: 4, name: "Black Pepper", amount: 2, unit: "teaspoon", original: "2 teaspoons freshly ground black pepper" }
    ],
    instructions: [
      "Boil pasta according to package directions",
      "Mix eggs and cheese",
      "Combine with hot pasta",
      "Season with black pepper"
    ].join('\n'),
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 650, unit: "kcal" },
        { name: "Protein", amount: 25, unit: "g" },
        { name: "Fat", amount: 28, unit: "g" },
        { name: "Carbohydrates", amount: 75, unit: "g" }
      ],
      healthLabels: []
    },
    summary: '',
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: true,
    veryPopular: true,
    sustainable: false,
    cuisines: [],
    diets: [],
    dishTypes: []
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    servings: 4,
    readyInMinutes: 45,
    pricePerServing: 3.0,
    extendedIngredients: [
      { id: 1, name: "Pizza Dough", amount: 1, unit: "pound", original: "1 pound pizza dough" },
      { id: 2, name: "Tomatoes", amount: 2, unit: "cups", original: "2 cups tomatoes" },
      { id: 3, name: "Fresh Mozzarella", amount: 8, unit: "ounces", original: "8 ounces fresh mozzarella" },
      { id: 4, name: "Fresh Basil", amount: 1, unit: "cup", original: "1 cup fresh basil" }
    ],
    instructions: [
      "Preheat oven to 500°F",
      "Roll out dough",
      "Add toppings",
      "Bake until crust is golden"
    ].join('\n'),
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 800, unit: "kcal" },
        { name: "Protein", amount: 30, unit: "g" },
        { name: "Fat", amount: 35, unit: "g" },
        { name: "Carbohydrates", amount: 100, unit: "g" }
      ],
      healthLabels: []
    },
    summary: '',
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: false,
    veryPopular: true,
    sustainable: false,
    cuisines: [],
    diets: [],
    dishTypes: []
  }
];

export const searchRecipes = async (query: string, page: number): Promise<Recipe[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return mockRecipes;
};

const getIngredients = async (recipeId: string): Promise<Ingredient[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${recipeId}/ingredientWidget.json?apiKey=${API_KEY}`
    );
    return response.data.ingredients.map((ing: any) => ({
      id: ing.id || Math.random(),
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      price: 0,
      imageUrl: ing.image
    }));
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

const fetchIngredients = async (recipeId: string): Promise<Ingredient[]> => {
  try {
    const response = await axios.get(`/api/recipes/${recipeId}/ingredients`);
    return response.data.map((ingredient: any) => ({
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      price: ingredient.price || 0,
      imageUrl: ingredient.image || ''
    }));
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

export const fetchRecipeWithIngredients = async (id: string): Promise<Recipe | null> => {
  try {
    const recipeResponse = await axios.get(`/api/recipes/${id}`);
    const ingredientsResponse: Ingredient[] = await fetchIngredients(id);
    const recipe = recipeResponse.data;
    
    return {
      id: parseInt(recipe.id.toString()),
      title: recipe.title,
      summary: recipe.summary,
      readyInMinutes: recipe.readyInMinutes,
      image: recipe.image,
      servings: recipe.servings,
      preparationMinutes: recipe.preparationMinutes || 15,
      pricePerServing: recipe.pricePerServing / 100,
      extendedIngredients: ingredientsResponse,
      instructions: Array.isArray(recipe.analyzedInstructions) 
        ? recipe.analyzedInstructions[0]?.steps.map((step: any) => step.step).join('\n') 
        : (recipe.instructions || ''),
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      totalCost: (recipe.pricePerServing / 100) * recipe.servings,
      nutrition: recipe.nutrition ? {
        nutrients: recipe.nutrition.nutrients?.map((nutrient: any) => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit
        })) || [],
        healthLabels: recipe.nutrition.healthLabels || []
      } : undefined,
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false,
      veryHealthy: recipe.veryHealthy || false,
      cheap: recipe.cheap || false,
      veryPopular: recipe.veryPopular || false,
      sustainable: recipe.sustainable || false,
      dishTypes: recipe.dishTypes || []
    };
  } catch (error) {
    console.error('Error fetching recipe with ingredients:', error);
    return null;
  }
};

interface RecipeInput {
  id?: string;
  title: string;
  summary: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  prepTime: number;
  extendedIngredients: Ingredient[];
  instructions: string[];
  cuisines: string[];
  diets: string[];
  nutrition: {
    nutrients: { name: string; amount: number; unit: string }[];
    healthLabels: string[];
  };
}

const defaultRecipe: RecipeInput = {
  title: '',
  summary: '',
  image: '',
  servings: 0,
  readyInMinutes: 0,
  prepTime: 0,
  extendedIngredients: [],
  instructions: [],
  cuisines: [],
  diets: [],
  nutrition: {
    nutrients: [],
    healthLabels: []
  }
};

export const createRecipe = async (recipeData: RecipeInput): Promise<Recipe> => {
  try {
    const recipe = transformRecipeResponse(recipeData);

    // Save to database or storage
    return recipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    // Mock data or fetch from database
    const mockRecipes: RecipeInput[] = [{
      title: 'Sample Recipe',
      summary: 'A sample recipe description',
      image: 'sample.jpg',
      servings: 4,
      readyInMinutes: 30,
      prepTime: 15,
      extendedIngredients: [],
      instructions: ['Step 1', 'Step 2'],
      cuisines: ['Italian'],
      diets: ['Vegetarian'],
      nutrition: {
        nutrients: [
          {
            name: 'Calories',
            amount: 500,
            unit: 'kcal'
          },
          {
            name: 'Protein',
            amount: 20,
            unit: 'g'
          }
        ],
        healthLabels: ['High-Protein', 'Vegetarian']
      }
    }];

    return mockRecipes.map(recipe => transformRecipeResponse(recipe));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export async function getRecipeById(id: number): Promise<Recipe | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find recipe by ID
  const recipe = mockRecipes.find(r => r.id === id);
  return recipe || null;
}

export async function getRandomRecipes(count: number = 3): Promise<Recipe[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Randomly select recipes
  const shuffled = [...mockRecipes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function getFavoriteRecipes(favoriteIds: number[]): Promise<Recipe[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter recipes by favorite IDs
  return mockRecipes.filter(recipe => favoriteIds.includes(parseInt(recipe.id.toString())));
} 