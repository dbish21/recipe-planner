import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme/theme';
import HomePage from './components/pages/HomePage';
import RecipeList from './components/pages/RecipeList';
import RecipeDetail from './components/pages/RecipeDetail';
import MealPlanner from './components/pages/MealPlanner';
import Favorites from './components/pages/Favorites';
import Layout from './components/layout/Layout';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  return (
    <FavoritesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </FavoritesProvider>
  );
}

export default App;