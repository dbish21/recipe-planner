import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Navbar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Recipe Planner
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/recipes"
            startIcon={<RestaurantMenuIcon />}
          >
            Recipes
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/meal-planner"
            startIcon={<CalendarMonthIcon />}
          >
            Meal Planner
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/favorites"
            startIcon={<FavoriteIcon />}
          >
            Favorites
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;