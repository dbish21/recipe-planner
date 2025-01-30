export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original?: string;
  originalName?: string;
  meta?: string[];
  image?: string;
  imageUrl?: string;
  price?: number;
  aisle?: string;
  consistency?: string;
  category?: string;
}

export interface Nutrition {
  nutrients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  healthLabels: string[];
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface BaseNutrition {
  nutrients: Nutrient[];
  healthLabels?: string[];
}

export interface ExtendedNutrition extends BaseNutrition {
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  healthLabels: string[];
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  pricePerServing: number;
  summary: string;
  instructions: string;
  extendedIngredients: Ingredient[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  nutrition?: BaseNutrition;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  totalCost?: number;
  preparationMinutes?: number;
}

export interface RecipeDetails extends Omit<Recipe, 'nutrition'> {
  nutrition?: ExtendedNutrition;
  healthLabels?: string[];
}

export interface NutritionInfo extends BaseNutrition {
  // Keep healthLabels optional as inherited from BaseNutrition
}

export interface RecipeSearchResponse {
  results: Recipe[];
  totalResults: number;
  number: number;
  offset: number;
}

export interface MealPlanRecipe extends Recipe {
  dayOfWeek: string;
  mealType: MealType;
}

export interface WeekPlan {
  [key: string]: {
    breakfast: MealPlanRecipe[];
    lunch: MealPlanRecipe[];
    dinner: MealPlanRecipe[];
  };
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

export const convertToMealPlanRecipe = (
  recipe: Recipe, 
  mealType: MealType = 'lunch', 
  dayOfWeek: string = 'Monday'
): MealPlanRecipe => {
  return {
    ...recipe,
    dayOfWeek,
    mealType,
  };
};

export const normalizeInstructions = (instructions: string | string[]): string[] => {
  if (typeof instructions === 'string') {
    return instructions.split('\n').filter(step => step.trim() !== '');
  }
  return instructions;
};

export const normalizeNutrition = (nutrition: any) => {
  if (!nutrition) return undefined;
  
  const nutrients = nutrition.nutrients || [];
  return {
    nutrients,
    healthLabels: nutrition.healthLabels || [],
    calories: nutrients.find((n: any) => n.name === 'Calories')?.amount,
    protein: nutrients.find((n: any) => n.name === 'Protein')?.amount,
    fat: nutrients.find((n: any) => n.name === 'Fat')?.amount,
    carbs: nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount,
  };
};