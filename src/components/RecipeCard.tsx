import React from 'react';
import { Recipe } from '../types/Recipe';
import { Card, CardContent, CardMedia, Typography, Box, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface RecipeCardProps {
  recipe: Recipe;
  actionButton?: React.ReactNode;
}

export default function RecipeCard({ recipe, actionButton }: RecipeCardProps) {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
          }}
        >
          {recipe.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.readyInMinutes} min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RestaurantIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.servings} servings
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {recipe.diets.slice(0, 3).map((diet, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.7rem',
              }}
            >
              {diet}
            </Typography>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        {actionButton || (
          <Button
            component={Link}
            to={`/recipe/${recipe.id}`}
            variant="contained"
            fullWidth
            sx={{
              textTransform: 'none',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            View Details
          </Button>
        )}
      </CardActions>
    </Card>
  );
} 