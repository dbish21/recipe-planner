import { format, startOfWeek, addDays } from 'date-fns';

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: PlannedMeal;
    lunch?: PlannedMeal;
    dinner?: PlannedMeal;
    snacks?: PlannedMeal[];
  };
  notes?: string;
}

export interface PlannedMeal {
  recipeId: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Default nutrition goals (can be customized by user)
export const defaultNutritionGoals: NutritionGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 70
};

// Helper function to generate empty week plan
export const generateEmptyWeekPlan = (startDate: Date = new Date()): MealPlan[] => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Start on Monday
  
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      id: format(date, 'yyyy-MM-dd'),
      date: format(date, 'yyyy-MM-dd'),
      meals: {}
    };
  });
};

// Calculate daily nutrition totals
export const calculateDailyNutrition = (meals: MealPlan['meals']): NutritionGoals => {
  const initial = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  return Object.values(meals).reduce((acc, meal) => {
    if (!meal) return acc;
    if (Array.isArray(meal)) {
      // Handle snacks array
      return meal.reduce((snackAcc, snack) => ({
        calories: snackAcc.calories + (snack.nutrition.calories || 0),
        protein: snackAcc.protein + (snack.nutrition.protein || 0),
        carbs: snackAcc.carbs + (snack.nutrition.carbs || 0),
        fat: snackAcc.fat + (snack.nutrition.fat || 0)
      }), acc);
    }
    
    return {
      calories: acc.calories + (meal.nutrition.calories || 0),
      protein: acc.protein + (meal.nutrition.protein || 0),
      carbs: acc.carbs + (meal.nutrition.carbs || 0),
      fat: acc.fat + (meal.nutrition.fat || 0)
    };
  }, initial);
};

// Calculate percentage of daily goals met
export const calculateGoalsProgress = (
  actual: NutritionGoals,
  goals: NutritionGoals = defaultNutritionGoals
): Record<keyof NutritionGoals, number> => {
  return {
    calories: (actual.calories / goals.calories) * 100,
    protein: (actual.protein / goals.protein) * 100,
    carbs: (actual.carbs / goals.carbs) * 100,
    fat: (actual.fat / goals.fat) * 100
  };
};
