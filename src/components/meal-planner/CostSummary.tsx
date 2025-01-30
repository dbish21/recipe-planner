import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MealPlanRecipe } from '../../types/MealPlan';

interface CostSummaryProps {
  open: boolean;
  onClose: () => void;
  recipes: MealPlanRecipe[];
}

const CostSummary: React.FC<CostSummaryProps> = ({ open, onClose, recipes }) => {
  const calculateTotalCost = (recipe: MealPlanRecipe): number => {
    return (recipe.pricePerServing * recipe.servings) || 0;
  };

  const totalPlanCost = recipes.reduce((total, recipe) => {
    return total + calculateTotalCost(recipe);
  }, 0);

  const averageMealCost = recipes.length > 0 ? totalPlanCost / recipes.length : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Cost Summary
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Cost Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Paper sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Plan Cost
              </Typography>
              <Typography variant="h4">
                ${(totalPlanCost / 100).toFixed(2)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Average Cost per Meal
              </Typography>
              <Typography variant="h4">
                ${(averageMealCost / 100).toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipe</TableCell>
                <TableCell align="right">Cost per Serving</TableCell>
                <TableCell align="right">Servings</TableCell>
                <TableCell align="right">Total Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>{recipe.title}</TableCell>
                  <TableCell align="right">
                    ${(recipe.pricePerServing / 100).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{recipe.servings}</TableCell>
                  <TableCell align="right">
                    ${(calculateTotalCost(recipe) / 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          * Costs are estimated based on average prices and may vary by location
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default CostSummary;