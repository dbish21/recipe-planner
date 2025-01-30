import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Dialog,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Timer as TimerIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  DroppableProps,
  DropResult,
  Draggable,
} from 'react-beautiful-dnd';
import { Recipe, Ingredient, MealType, DAYS, MEAL_TYPES, convertToMealPlanRecipe, MealPlanRecipe } from '../../types/Recipe';
import RecipeSearchDialog from '../meal-planner/RecipeSearchDialog';
import ShoppingList from '../meal-planner/Shoppinglist';
import { getFavorites } from '../../services/favorites';
import { getRecipeById, searchRecipes } from '../../services/spoonacularService';
import RecipeCard from '../RecipeCard';
import MealPlanCostSummary from '../MealPlanCostSummary';
import RemoveIcon from '@mui/icons-material/Remove';

type MealPlanDay = {
  breakfast: MealPlanRecipe[];
  lunch: MealPlanRecipe[];
  dinner: MealPlanRecipe[];
}

type WeeklyMealPlan = {
  [key: string]: MealPlanDay;
}

const MEAL_PLAN_STORAGE_KEY = 'mealPlanData';

const getInitialMealPlan = (): WeeklyMealPlan => {
  const savedMealPlan = localStorage.getItem(MEAL_PLAN_STORAGE_KEY);
  if (savedMealPlan) {
    return JSON.parse(savedMealPlan);
  }
  
  return DAYS.reduce((acc, day) => {
    acc[day] = {
      breakfast: [],
      lunch: [],
      dinner: []
    };
    return acc;
  }, {} as WeeklyMealPlan);
};

// Create a wrapper component for Droppable that uses modern props pattern
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const MealPlanner: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan>(getInitialMealPlan);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [recipeSource, setRecipeSource] = useState<'favorites' | 'all'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (recipeSource === 'favorites') {
          const favoriteIds = getFavorites();
          const favoriteRecipes = await Promise.all(
            favoriteIds.map(id => getRecipeById(id))
          );
          const validRecipes = favoriteRecipes.filter((recipe): recipe is Recipe => recipe !== null);
          setAvailableRecipes(validRecipes);
        } else {
          // Load initial set of recipes with empty query
          const results = await searchRecipes('', 1);
          setAvailableRecipes(results.recipes);
        }
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [recipeSource]);

  // Save to localStorage whenever mealPlan changes
  useEffect(() => {
    localStorage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(mealPlan));
  }, [mealPlan]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedRecipe = availableRecipes.find(recipe => recipe.id.toString() === result.draggableId);
    
    if (!draggedRecipe) return;

    const [day, mealType] = destination.droppableId.split('-') as [string, MealType];

    const newMealPlanRecipe: MealPlanRecipe = {
      ...draggedRecipe,
      dayOfWeek: day,
      mealType: mealType,
      extendedIngredients: draggedRecipe.extendedIngredients || [],
      instructions: draggedRecipe.instructions || '',
      summary: draggedRecipe.summary || '',
      image: draggedRecipe.image || ''
    };

    setMealPlan(prev => {
      const updatedPlan = { ...prev };
      updatedPlan[day][mealType] = [
        ...(updatedPlan[day][mealType] || []),
        newMealPlanRecipe
      ];
      return updatedPlan;
    });
  };

  const handleAddRecipe = (day: string) => {
    setSelectedDay(day);
    setSearchDialogOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (!selectedDay) return;

    const mealPlanRecipe: MealPlanRecipe = {
      ...recipe,
      dayOfWeek: selectedDay,
      mealType: 'dinner' // Default meal type
    };

    setMealPlan((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        dinner: [...prev[selectedDay].dinner, mealPlanRecipe],
      },
    }));
    setSearchDialogOpen(false);
  };

  const handleRemoveRecipe = (day: string, mealType: MealType) => {
    setMealPlan(prev => {
      const updatedPlan = { ...prev };
      updatedPlan[day][mealType] = [];
      return updatedPlan;
    });
  };

  const getAllRecipes = (): MealPlanRecipe[] => {
    return Object.values(mealPlan).flatMap(day => 
      [...day.breakfast, ...day.lunch, ...day.dinner]
    );
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleDaySelect = (day: string, mealType: MealType) => {
    if (!selectedRecipe) return;

    setMealPlan(prev => {
      const updatedPlan = { ...prev };
      const newRecipe: MealPlanRecipe = {
        ...selectedRecipe,
        dayOfWeek: day,
        mealType: mealType
      };
      
      updatedPlan[day][mealType] = [newRecipe];
      
      return updatedPlan;
    });

    setSelectedRecipe(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const { recipes } = await searchRecipes(searchQuery);
      setSearchResults(recipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    const mealPlanRecipe = convertToMealPlanRecipe(recipe, selectedMealType, selectedDay);
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [selectedDay]: {
        ...prevPlan[selectedDay],
        [selectedMealType]: [...prevPlan[selectedDay][selectedMealType], mealPlanRecipe]
      }
    }));
  };

  const handleRemoveFromMealPlan = (day: string, mealType: MealType, recipeIndex: number) => {
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: prevPlan[day][mealType].filter((_, index) => index !== recipeIndex)
      }
    }));
  };

  const handleUpdateServings = (day: string, mealType: MealType, recipeIndex: number, newServings: number) => {
    if (newServings < 1) return;
    
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: prevPlan[day][mealType].map((recipe, index) => 
          index === recipeIndex 
            ? { ...recipe, servings: newServings }
            : recipe
        )
      }
    }));
  };

  return (
    <>
      {/* Search Bar at the very top */}
      <Box 
        component="form" 
        onSubmit={handleSearch} 
        sx={{ 
          p: 3,
          pt: 2,
          pb: 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              label="Search recipes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={isLoading}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Meal Planner
        </Typography>

        {/* Cost Summary */}
        <MealPlanCostSummary mealPlan={mealPlan} />

        {/* Meal Selection */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={selectedDay}
                  label="Day"
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {DAYS.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Meal</InputLabel>
                <Select
                  value={selectedMealType}
                  label="Meal"
                  onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                >
                  {MEAL_TYPES.map((meal) => (
                    <MenuItem key={meal} value={meal}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Recipe Selection Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={recipeSource}
                  onChange={(_, newValue) => setRecipeSource(newValue)}
                  aria-label="recipe source tabs"
                >
                  <Tab 
                    label="Favorites" 
                    value="favorites"
                    icon={<FavoriteIcon />}
                    iconPosition="start"
                  />
                  <Tab 
                    label="All Recipes" 
                    value="all"
                    icon={<MenuBookIcon />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
              <CardContent>
                {loading ? (
                  <Typography>Loading recipes...</Typography>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                    {availableRecipes.map((recipe) => (
                      <Card 
                        key={recipe.id}
                        sx={{ 
                          mb: 2, 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: selectedRecipe?.id === recipe.id ? 'action.selected' : 'background.paper',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3,
                          }
                        }}
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        <CardContent>
                          <Typography variant="h6">{recipe.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimerIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                              <Typography variant="body2">{recipe.readyInMinutes} min</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MoneyIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                              <Typography variant="body2">${(recipe.pricePerServing / 100).toFixed(2)}/serving</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Grid>

          {/* Meal Plan Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              {DAYS.map((day) => (
                <Box key={day} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: 'primary.main',
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 1
                  }}>
                    {day}
                  </Typography>
                  <Grid container spacing={2}>
                    {MEAL_TYPES.map((mealType) => (
                      <Grid item xs={12} sm={4} key={`${day}-${mealType}`}>
                        <Paper
                          sx={{ 
                            p: 2,
                            height: '100%',
                            border: '1px dashed',
                            borderColor: selectedRecipe ? 'primary.main' : 'divider',
                            bgcolor: selectedRecipe ? 'action.hover' : 'background.default',
                            cursor: selectedRecipe ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            '&:hover': selectedRecipe ? {
                              bgcolor: 'action.selected',
                              transform: 'translateY(-2px)',
                            } : {}
                          }}
                          onClick={() => selectedRecipe && handleDaySelect(day, mealType)}
                        >
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </Typography>
                          {mealPlan[day][mealType].map((recipe, index) => (
                            <Box 
                              key={`${recipe.id}-${index}`}
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mt: 1
                              }}
                            >
                              <Typography variant="body2">{recipe.title}</Typography>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromMealPlan(day, mealType, index);
                                }}
                                sx={{ 
                                  ml: 1,
                                  '&:hover': {
                                    color: 'error.main'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <RecipeSearchDialog
          open={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
          onRecipeSelect={handleRecipeSelect}
        />

        <Dialog
          open={shoppingListOpen}
          onClose={() => setShoppingListOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <ShoppingList recipes={getAllRecipes()} />
        </Dialog>

        {/* Search Results */}
        <Box sx={{ mb: 4 }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {searchResults.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <RecipeCard
                    recipe={recipe}
                    actionButton={
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToMealPlan(recipe)}
                        fullWidth
                        sx={{
                          textTransform: 'none',
                        }}
                      >
                        Add to {selectedMealType} on {selectedDay}
                      </Button>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {!isLoading && searchResults.length === 0 && searchQuery && (
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No recipes found. Try a different search term.
            </Typography>
          )}
        </Box>

        {/* Display current meal plan */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ 
            borderBottom: 2, 
            borderColor: 'primary.main',
            pb: 1,
            mb: 3 
          }}>
            Current Meal Plan
          </Typography>
          {DAYS.map((day) => (
            <Paper 
              key={day} 
              elevation={2}
              sx={{ 
                mb: 3,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                p: 2,
              }}>
                <Typography variant="h6">{day}</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  {MEAL_TYPES.map((mealType) => (
                    <Grid item xs={12} sm={4} key={mealType}>
                      <Box sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        height: '100%'
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 2,
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </Typography>
                        {mealPlan[day][mealType].length === 0 ? (
                          <Box sx={{ 
                            p: 2, 
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 1,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              No meals planned
                            </Typography>
                          </Box>
                        ) : (
                          mealPlan[day][mealType].map((recipe, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                mb: 2,
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': {
                                  boxShadow: 2,
                                  borderColor: 'primary.light'
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 1
                              }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 'medium',
                                    color: 'text.primary'
                                  }}
                                >
                                  {recipe.title}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveFromMealPlan(day, mealType, index)}
                                  sx={{ 
                                    '&:hover': { 
                                      bgcolor: 'error.light',
                                      color: 'error.contrastText'
                                    }
                                  }}
                                >
                                  Remove
                                </IconButton>
                              </Box>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 1,
                                pt: 1,
                                borderTop: '1px solid',
                                borderColor: 'divider'
                              }}>
                                <Typography variant="body2" color="text.secondary">
                                  ${(recipe.pricePerServing / 100).toFixed(2)}/serving
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 1,
                                  bgcolor: 'action.hover',
                                  borderRadius: 1,
                                  px: 1
                                }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUpdateServings(day, mealType, index, recipe.servings - 1)}
                                    disabled={recipe.servings <= 1}
                                    sx={{ 
                                      color: 'primary.main',
                                      '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
                                    {recipe.servings} servings
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUpdateServings(day, mealType, index, recipe.servings + 1)}
                                    sx={{ 
                                      color: 'primary.main',
                                      '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MealPlanner;

