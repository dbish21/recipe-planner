import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Recipe } from '../../types/Recipe';
import RecipeCard from '../recipe/RecipeCard';
import { searchRecipes } from '../../services/recipeService';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await searchRecipes("", 0); // 0 for non-exact match
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading recipes..." />;
  }

  if (error) {
    return (
      <EmptyState 
        message={error}
        actionLabel="Try Again"
        onAction={() => window.location.reload()} title={''}      />
    );
  }

  if (!recipes.length) {
    return (
      <EmptyState 
        message="No recipes found"
        actionLabel="Refresh"
        onAction={() => window.location.reload()} title={''}      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipes
      </Typography>
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <RecipeCard
              recipe={recipe}
              isFavorite={false}
              onFavoriteClick={() => {}}
              onViewDetails={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Recipes;