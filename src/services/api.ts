const API_KEY = 'c90da9874fa542c3a0053504b9014fb1';
const BASE_URL = 'https://api.spoonacular.com/recipes';

interface SearchParams {
  cuisine?: string;
  diet?: string;
  maxReadyTime?: number;
  intolerances?: string;
}

export const searchRecipes = async (query: string, params: SearchParams = {}) => {
  try {
    let url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${query}&addRecipeInformation=true`;
    
    if (params.cuisine) url += `&cuisine=${params.cuisine}`;
    if (params.diet) url += `&diet=${params.diet}`;
    if (params.maxReadyTime) url += `&maxReadyTime=${params.maxReadyTime}`;
    if (params.intolerances) url += `&intolerances=${params.intolerances}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${API_KEY}&addRecipeNutrition=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

