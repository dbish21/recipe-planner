import { Recipe } from './Recipe';

export interface MealPlanRecipe extends Recipe {
  extendedIngredients: any;
  dayOfWeek: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface MealPlan {
  [key: string]: MealPlanRecipe[];
} 