import axios from 'axios';
import { NutritionData } from '../types/NutritionData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const analyzeRecipe = async (ingredients: string[]): Promise<NutritionData> => {
  try {
    console.log('Sending ingredients to backend:', ingredients);
    
    const response = await axios.post(`${API_BASE_URL}/api/nutrition/analyze`, {
      ingredients
    });
    
    console.log('Backend response:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error analyzing recipe with Edamam:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getNutritionData = async (ingredient: string): Promise<NutritionData> => {
  try {
    console.log('Sending ingredient to backend:', ingredient); // Debug log
    
    if (!ingredient || typeof ingredient !== 'string') {
      throw new Error('Invalid ingredient data');
    }

    const response = await axios.get(`${API_BASE_URL}/api/nutrition/data`, {
      params: { ingredient: ingredient.trim() }
    });
    
    console.log('Backend response:', response.data); // Debug log
    return response.data;
  } catch (error: any) {
    console.error('Error getting nutrition data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Helper function to get specific nutrient value
export const getNutrientValue = (
  nutrition: NutritionData,
  nutrientId: string
): { value: number; unit: string } | null => {
  const nutrient = nutrition.totalNutrients[nutrientId];
  if (!nutrient) return null;
  
  return {
    value: Math.round(nutrient.quantity),
    unit: nutrient.unit
  };
};

// Common nutrient IDs for reference
export const NUTRIENT_IDS = {
  CALORIES: 'ENERC_KCAL',
  PROTEIN: 'PROCNT',
  FAT: 'FAT',
  CARBS: 'CHOCDF',
  FIBER: 'FIBTG',
  SUGAR: 'SUGAR',
  SODIUM: 'NA',
  CALCIUM: 'CA',
  IRON: 'FE',
  POTASSIUM: 'K',
  VITAMIN_A: 'VITA_RAE',
  VITAMIN_C: 'VITC',
  VITAMIN_D: 'VITD',
  CHOLESTEROL: 'CHOLE',
  SATURATED_FAT: 'FASAT',
};
