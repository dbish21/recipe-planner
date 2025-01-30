import React from 'react';
import { 
  Container, 
  Typography, 
  Button,
  Box,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MenuBookIcon />,
      title: 'Recipe Collection',
      description: 'Access a vast collection of delicious recipes'
    },
    {
      icon: <CalendarTodayIcon />,
      title: 'Meal Planning',
      description: 'Plan your weekly meals with ease'
    },
    {
      icon: <LocalGroceryStoreIcon />,
      title: 'Shopping Lists',
      description: 'Automatically generate shopping lists'
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Time Saving',
      description: 'Save time on meal preparation'
    },
    {
      icon: <FavoriteIcon />,
      title: 'Save Favorites',
      description: 'Keep track of your favorite recipes'
    },
    {
      icon: <RestaurantMenuIcon />,
      title: 'Organized Cooking',
      description: 'Keep your cooking organized and stress-free'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2C3E50 30%, #3498DB 90%)',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white !important' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                mb: 4,
                color: 'white !important',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Recipe Planner
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6,
                color: 'white !important',
                opacity: 1,
                textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              Plan your meals, discover new recipes, and simplify your cooking experience
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<CalendarTodayIcon />}
                onClick={() => navigate('/meal-planner')}
                sx={{
                  bgcolor: 'white',
                  color: '#2C3E50',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Start Planning
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RestaurantMenuIcon />}
                onClick={() => navigate('/recipes')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Browse Recipes
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Everything You Need for Meal Planning
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ 
                    color: 'primary.main',
                    mb: 2,
                    '& > svg': { fontSize: 40 }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;