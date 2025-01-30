import React from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';

// Define the RecipeDetails interface here instead of importing it
interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    name: string;
  }>;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

interface PrintOptions {
  showImage: boolean;
  showNutrition: boolean;
  showNotes: boolean;
  notes: string;
  theme: string;
  cardsPerPage: number;
}

interface PrintableRecipeProps {
  recipe: RecipeDetails;
  options: PrintOptions;
}

const PrintableRecipe: React.FC<PrintableRecipeProps> = ({
  recipe,
  options
}) => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {recipe.title}
      </Typography>

      {options.showImage && (
        <Box sx={{ mb: 3 }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          Prep Time: {recipe.readyInMinutes} minutes | Servings: {recipe.servings}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ingredients
        </Typography>
        <List>
          {recipe.extendedIngredients.map((ingredient, index: number) => (
            <ListItem key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      </Box>

      {options.showNutrition && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Nutrition Information
          </Typography>
          <List>
            {recipe.nutrition.nutrients
              .filter((nutrient) => 
                ['Calories', 'Protein', 'Carbohydrates', 'Fat'].includes(nutrient.name)
              )
              .map((nutrient, index: number) => (
                <ListItem key={index}>
                  {nutrient.name}: {Math.round(nutrient.amount)}{nutrient.unit}
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      {options.showNotes && options.notes && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body1">
            {options.notes}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PrintableRecipe;