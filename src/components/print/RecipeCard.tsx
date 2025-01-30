import React from 'react';
import { Box, Typography, List, ListItem, Card, CardContent, CardMedia } from '@mui/material';

// Define the RecipeDetails interface here
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

interface RecipeCardProps {
  recipe: RecipeDetails;
  options: PrintOptions;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  options
}) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {options.showImage && (
        <CardMedia
          component="img"
          height="140"
          image={recipe.image}
          alt={recipe.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {recipe.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {recipe.readyInMinutes} min | {recipe.servings} servings
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Ingredients:
        </Typography>
        <List dense>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <Typography variant="body2">
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </Typography>
            </ListItem>
          ))}
        </List>

        {options.showNutrition && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Nutrition:
            </Typography>
            <List dense>
              {recipe.nutrition.nutrients
                .filter((nutrient) => 
                  ['Calories', 'Protein', 'Carbohydrates', 'Fat'].includes(nutrient.name)
                )
                .map((nutrient, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <Typography variant="body2">
                      {nutrient.name}: {Math.round(nutrient.amount)}{nutrient.unit}
                    </Typography>
                  </ListItem>
                ))}
            </List>
          </Box>
        )}

        {options.showNotes && options.notes && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notes:
            </Typography>
            <Typography variant="body2">
              {options.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;