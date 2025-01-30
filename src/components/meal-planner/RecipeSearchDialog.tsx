import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Timer as TimerIcon } from '@mui/icons-material';
import { Recipe } from '../../types/Recipe';
import { searchRecipes } from '../../services/recipeService';

interface RecipeSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeSearchDialog: React.FC<RecipeSearchDialogProps> = ({
  open,
  onClose,
  onRecipeSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const searchResults = await searchRecipes(searchQuery, page);
      setRecipes(searchResults);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const moreResults = await searchRecipes(searchQuery, nextPage);
      setRecipes([...recipes, ...moreResults]);
      setPage(nextPage);
    } catch (err) {
      setError('Failed to load more recipes. Please try again.');
      console.error('Load more error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Search Recipes</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mt: 1 }}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image}
                  alt={recipe.title}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {recipe.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimerIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {recipe.readyInMinutes} minutes
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.summary 
                      ? `${recipe.summary.slice(0, 100)}...` 
                      : 'No description available'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => {
                      onRecipeSelect(recipe);
                      onClose();
                    }}
                    aria-label="add recipe"
                  >
                    <AddIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {recipes.length > 0 && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={handleLoadMore}>Load More</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeSearchDialog;
