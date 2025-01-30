import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Meal Planner', path: '/meal-planner', icon: <CalendarMonthIcon /> },
    { label: 'Favorites', path: '/favorites', icon: <FavoriteIcon /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#2C3E50' }}>
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  selected={isActive(item.path)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    {item.label}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    bgcolor: 'white',
                    transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.2s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;