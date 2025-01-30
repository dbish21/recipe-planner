import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Recipe } from '../../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onViewDetails: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onFavoriteClick,
  onViewDetails,
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onClick={onViewDetails}
    >
      {recipe.image && (
        <CardMedia
          component="img"
          height="200"
          image={recipe.image}
          alt={recipe.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {recipe.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {recipe.servings} servings
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick();
          }}
          size="small"
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RecipeCard; 