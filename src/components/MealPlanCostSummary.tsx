import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { MealPlanRecipe, DAYS } from '../types/Recipe';

interface MealPlanCostSummaryProps {
  mealPlan: {
    [key: string]: {
      breakfast: MealPlanRecipe[];
      lunch: MealPlanRecipe[];
      dinner: MealPlanRecipe[];
    };
  };
}

export default function MealPlanCostSummary({ mealPlan }: MealPlanCostSummaryProps) {
  const calculateDayCost = (day: string) => {
    const dayMeals = mealPlan[day];
    if (!dayMeals) return 0;

    const totalCost = Object.values(dayMeals).reduce((mealTypeCost, meals) => {
      return mealTypeCost + meals.reduce((cost, meal) => {
        return cost + ((meal.pricePerServing / 100) * meal.servings);
      }, 0);
    }, 0);

    return Number(totalCost.toFixed(2));
  };

  const calculateWeekTotal = () => {
    return Number(
      DAYS.reduce((total, day) => total + calculateDayCost(day), 0).toFixed(2)
    );
  };

  return (
    <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cost Summary (Total Cost with Servings)
      </Typography>
      
      <Grid container spacing={2}>
        {DAYS.map((day) => {
          const dayCost = calculateDayCost(day);
          return (
            <Grid item xs={12} sm={6} md={3} key={day}>
              <Box sx={{ 
                p: 2, 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Typography variant="subtitle1">{day}</Typography>
                <Typography variant="subtitle1" color="primary">
                  ${dayCost}
                </Typography>
              </Box>
            </Grid>
          );
        })}
        
        <Grid item xs={12}>
          <Box sx={{ 
            p: 2, 
            mt: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6">Weekly Total</Typography>
            <Typography variant="h6">
              ${calculateWeekTotal()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
} 