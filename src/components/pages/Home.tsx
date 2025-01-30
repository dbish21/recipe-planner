import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RestaurantMenuIcon sx={{ fontSize: 40 }} />,
      title: 'Browse Recipes',
      description: 'Explore our collection of delicious recipes',
      action: () => navigate('/recipes'),
    },
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
      title: 'Meal Planning',
      description: 'Plan your weekly meals with ease',
      action: () => navigate('/meal-planner'),
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: 'Favorites',
      description: 'Save and organize your favorite recipes',
      action: () => navigate('/favorites'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 8, 
        mb: 6, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 3
          }}
        >
          Recipe Planner
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ maxWidth: 600, mb: 4 }}
        >
          Your personal kitchen assistant for meal planning and recipe management
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {feature.description}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={feature.action}
                sx={{ mt: 'auto' }}
              >
                Get Started
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;