import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Timer as TimerIcon,
  Restaurant as ServingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types/Recipe';
import { getFavorites as getFavoriteIds, removeFavorite } from '../../services/favorites';
import { getRecipeById } from '../../services/spoonacularService';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteIds = getFavoriteIds();
      if (!favoriteIds.length) {
        setLoading(false);
        return;
      }

      const recipePromises = favoriteIds.map(async (id) => {
        if (typeof id !== 'number' || isNaN(id)) {
          console.error('Invalid favorite ID:', id);
          return null;
        }
        return getRecipeById(id);
      });

      const recipes = await Promise.all(recipePromises);
      setFavorites(recipes.filter((recipe): recipe is Recipe => recipe !== null));
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId: number) => {
    try {
      removeFavorite(recipeId);
      setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleViewDetails = (recipeId: string | number) => {
    const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId;
    navigate(`/recipes/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Favorite Recipes
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven't added any favorites yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="194"
                  image={recipe.image}
                  alt={recipe.title}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {recipe.summary ? recipe.summary.slice(0, 100) + '...' : 'No description available'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimerIcon sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {recipe.readyInMinutes} min
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ServingsIcon sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {recipe.servings} servings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    aria-label="remove from favorites"
                    onClick={() => handleRemoveFavorite(recipe.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    size="small"
                    onClick={() => handleViewDetails(recipe.id)}
                    sx={{ ml: 'auto' }}
                  >
                    View Recipe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;