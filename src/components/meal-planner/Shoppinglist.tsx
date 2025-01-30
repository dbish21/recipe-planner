import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
} from '@mui/material';
import { MealPlanRecipe } from '../../types/MealPlan';
import { Ingredient } from '../../types/Recipe';

interface ShoppingListProps {
  recipes: MealPlanRecipe[];
}

interface IngredientGroup {
  [key: string]: Ingredient[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ recipes }) => {
  const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>({});

  // Group ingredients by name and combine quantities
  const groupedIngredients = React.useMemo(() => {
    const groups: IngredientGroup = {};

    recipes.forEach((recipe) => {
      recipe.extendedIngredients.forEach((ingredient: Ingredient) => {
        if (!groups[ingredient.name]) {
          groups[ingredient.name] = [];
        }
        groups[ingredient.name].push(ingredient);
      });
    });

    return groups;
  }, [recipes]);

  const handleToggle = (ingredientName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [ingredientName]: !prev[ingredientName],
    }));
  };

  // Calculate total amount for each ingredient
  const calculateTotalAmount = (ingredients: Ingredient[]): string => {
    const total = ingredients.reduce((sum, ing) => sum + ing.amount, 0);
    const unit = ingredients[0]?.unit || '';
    return `${total.toFixed(2)} ${unit}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shopping List
      </Typography>
      
      <List>
        {Object.entries(groupedIngredients).map(([name, ingredients]) => (
          <ListItem
            key={name}
            dense
            button
            onClick={() => handleToggle(name)}
            sx={{
              textDecoration: checkedItems[name] ? 'line-through' : 'none',
              color: checkedItems[name] ? 'text.disabled' : 'text.primary',
            }}
          >
            <Checkbox
              edge="start"
              checked={!!checkedItems[name]}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={name}
              secondary={calculateTotalAmount(ingredients)}
            />
          </ListItem>
        ))}
      </List>

      {Object.keys(groupedIngredients).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No ingredients to display. Add some recipes to your meal plan!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ShoppingList;