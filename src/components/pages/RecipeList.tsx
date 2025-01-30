import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography,
  Box,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types/Recipe';
import { saveFavorite, removeFavorite, isFavorite, getFavorites } from '../../services/favorites';
import RecipeCard from '../recipe/RecipeCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import SearchBar from '../ui/SearchBar';

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const BASE_URL = process.env.REACT_APP_SPOONACULAR_BASE_URL || 'https://api.spoonacular.com/recipes/';

console.log('Environment variables:', {
  REACT_APP_API_KEY: process.env.REACT_APP_SPOONACULAR_API_KEY,
  NODE_ENV: process.env.NODE_ENV
});

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    new Set(getFavorites())
  );

  const fetchRecipes = async (query: string = '', currentPage: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        apiKey: API_KEY || '',
        query: query,
        number: '9',
        offset: ((currentPage - 1) * 9).toString(),
        addRecipeInformation: 'true',
        fillIngredients: 'true'
      });

      const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
      const url = `${baseUrl}/complexSearch?${searchParams.toString()}`;
      console.log('Fetching from URL:', url); // Debug log

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const formattedRecipes: Recipe[] = data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        servings: recipe.servings,
        readyInMinutes: recipe.readyInMinutes,
        pricePerServing: recipe.pricePerServing,
        summary: recipe.summary,
        instructions: recipe.instructions,
        extendedIngredients: recipe.extendedIngredients.map((ingredient: any) => ({
          id: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      }));

      setRecipes(formattedRecipes);
      setTotalPages(Math.ceil(data.totalResults / 9));
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please check your API key and try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (API_KEY) {
      fetchRecipes(searchQuery, page);
    } else {
      setError('API key is missing. Please check your environment variables.');
      setLoading(false);
    }
  }, [page, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFavoriteClick = (recipe: Recipe) => {
    try {
      if (isFavorite(recipe.id)) {
        removeFavorite(recipe.id);
        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(recipe.id);
          return next;
        });
      } else {
        saveFavorite(recipe.id);
        setFavoriteIds(prev => new Set(prev).add(recipe.id));
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Discover Recipes
        </Typography>
        <SearchBar onSearch={handleSearch} />
      </Box>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {loading ? (
        <LoadingSpinner message="Loading recipes..." />
      ) : (
        <>
          <Grid container spacing={4}>
            {recipes.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <RecipeCard 
                  recipe={recipe}
                  onViewDetails={() => navigate(`/recipes/${recipe.id}`)}
                  isFavorite={favoriteIds.has(recipe.id)}
                  onFavoriteClick={() => handleFavoriteClick(recipe)}
                />
              </Grid>
            ))}
          </Grid>
          
          {recipes.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {recipes.length === 0 && !loading && !error && (
            <Typography align="center" color="textSecondary">
              No recipes found. Try a different search term.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default RecipeList; 