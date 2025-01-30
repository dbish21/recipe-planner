import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton,
  Rating,
  TextField,
  Button,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getRecipeById } from '../../services/spoonacularService';
import { saveFavorite, removeFavorite, isFavorite } from '../../services/favorites';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Label 
} from 'recharts';
import { alpha } from '@mui/material/styles';
import { getReviews, addReview, updateReview, deleteReview, type Review } from '../../services/reviews';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import QRCode from 'react-qr-code';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { decimalToFraction } from '../../utils/fractions';
import { convertUnit, isConvertibleUnit, getCompatibleUnits } from '../../utils/units';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import PrintableRecipe from '../print/PrintableRecipe';
import RecipeCard from '../print/RecipeCard';
import { cardThemes } from '../print/cardThemes';
import { analyzeRecipe } from '../../services/edamamService';
import { Recipe, Ingredient, normalizeInstructions } from '../../types/Recipe';
import { NutritionData } from '../../types/NutritionData';

export interface PrintOptions {
  showImage: boolean;
  showNutrition: boolean;
  showNotes: boolean;
  notes: string;
  theme: string;
  cardsPerPage: number;
}

interface RecipeDetails extends Omit<Recipe, 'image' | 'summary' | 'instructions'> {
  image: string;  // Make image required
  summary: string;  // Make summary required
  instructions: string;  // Make instructions string only
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
  };
}

export interface PrintableRecipeProps {
  recipe: RecipeDetails;
  options: PrintOptions;
}

export interface RecipeCardProps {
  recipe: RecipeDetails;
  options: PrintOptions;
}

const MacroChart = ({ nutrients }: { nutrients: RecipeDetails['nutrition']['nutrients'] }) => {
  const macros = nutrients
    .filter(n => ['Protein', 'Carbohydrates', 'Fat'].includes(n.name))
    .map(n => ({
      name: n.name,
      value: Math.round(n.amount),
      calories: Math.round(n.amount * (n.name === 'Fat' ? 9 : 4))
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={macros}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} ${value}g`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {macros.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value}g (${macros.find(m => m.name === name)?.calories} cal)`, name]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CalorieBreakdown = ({ nutrients }: { nutrients: RecipeDetails['nutrition']['nutrients'] }) => {
  const macros = nutrients
    .filter(n => ['Protein', 'Carbohydrates', 'Fat'].includes(n.name))
    .map(n => ({
      name: n.name,
      calories: Math.round(n.amount * (n.name === 'Fat' ? 9 : 4)),
      amount: Math.round(n.amount)
    }));

  const totalCalories = macros.reduce((sum, macro) => sum + macro.calories, 0);

  const data = macros.map(macro => ({
    ...macro,
    percentage: Math.round((macro.calories / totalCalories) * 100)
  }));

  const COLORS = {
    Protein: '#0088FE',
    Carbohydrates: '#00C49F',
    Fat: '#FFBB28'
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom align="center">
        Total Calories: {totalCalories}
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#666">
              <Label value="Calories" angle={-90} position="insideLeft" />
            </YAxis>
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#666"
              tickFormatter={(value) => `${value}%`}
            >
              <Label value="% of Total" angle={90} position="insideRight" />
            </YAxis>
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'calories') return [`${value} calories`, 'Calories'];
                if (name === 'amount') return [`${value}g`, 'Amount'];
                if (name === 'percentage') return [`${value}%`, '% of Total'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="calories"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mt: 2 }}>
        {data.map(macro => (
          <Box 
            key={macro.name}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 1,
              p: 1,
              bgcolor: alpha(COLORS[macro.name as keyof typeof COLORS], 0.1),
              borderRadius: 1
            }}
          >
            <Typography variant="body2">
              {macro.name}
            </Typography>
            <Typography variant="body2">
              {macro.amount}g ({macro.calories} cal, {macro.percentage}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const NutritionAnalysis: React.FC<{ ingredients: any[] }> = ({ ingredients }) => {
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analysisRef = useRef<boolean>(false);

  useEffect(() => {
    if (!ingredients?.length || analysisRef.current) return;

    const analyzeNutrition = async () => {
      try {
        setIsAnalyzing(true);
        console.log('Starting nutrition analysis');

        const ingredientStrings = ingredients.map(ing => 
          `${ing.amount} ${ing.unit} ${ing.name}`.trim()
        ).filter(Boolean);

        const data = await analyzeRecipe(ingredientStrings);
        setNutritionData(data);
        analysisRef.current = true;
      } catch (err) {
        console.error('Analysis failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze recipe');
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeNutrition();
  }, [ingredients]);

  if (isAnalyzing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={20} />
        <Typography sx={{ ml: 2 }}>Analyzing nutrition...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!nutritionData) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calories: {nutritionData.calories}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Servings: {nutritionData.yield}
      </Typography>
      {nutritionData.totalNutrients && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nutrients
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(nutritionData.totalNutrients)
              .filter(([_, nutrient]: [string, any]) => nutrient.quantity > 0)
              .map(([key, nutrient]: [string, any]) => (
                <Grid item xs={6} sm={4} key={key}>
                  <Typography variant="body2">
                    <strong>{nutrient.label}:</strong>{' '}
                    {Math.round(nutrient.quantity)}{nutrient.unit}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

const NutritionCard = ({ nutrients }: { nutrients: RecipeDetails['nutrition']['nutrients'] }) => {
  const mainNutrients = ['Calories', 'Protein', 'Carbohydrates', 'Fat'];
  const vitamins = ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin B6', 'Vitamin B12'];
  const minerals = ['Iron', 'Calcium', 'Potassium', 'Magnesium', 'Zinc'];
  const others = ['Fiber', 'Sugar', 'Cholesterol', 'Sodium', 'Saturated Fat'];
  
  // Daily Value reference amounts (in the same units as the API response)
  const dailyValues: { [key: string]: number } = {
    'Calories': 2000,
    'Protein': 50,
    'Carbohydrates': 275,
    'Fat': 78,
    'Fiber': 28,
    'Sugar': 50,
    'Vitamin A': 900,
    'Vitamin C': 90,
    'Vitamin D': 20,
    'Vitamin B6': 1.7,
    'Vitamin B12': 2.4,
    'Iron': 18,
    'Calcium': 1300,
    'Potassium': 4700,
    'Magnesium': 420,
    'Zinc': 11,
    'Sodium': 2300,
    'Cholesterol': 300,
    'Saturated Fat': 20,
  };

  const calculateDV = (amount: number, nutrient: string) => {
    if (!dailyValues[nutrient]) return null;
    return Math.round((amount / dailyValues[nutrient]) * 100);
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Nutrition Facts</Typography>
      
      {/* Main Nutrients with DV% */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {nutrients
          .filter(nutrient => mainNutrients.includes(nutrient.name))
          .map((nutrient) => {
            const dv = calculateDV(nutrient.amount, nutrient.name);
            return (
              <Grid item xs={6} sm={3} key={nutrient.name}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    {Math.round(nutrient.amount)}
                    <Typography component="span" variant="caption" sx={{ ml: 0.5 }} color="white">
                      {nutrient.unit}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="white">
                    {nutrient.name}
                    {dv && ` (${dv}% DV)`}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
      </Grid>

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Macronutrient Distribution
        </Typography>
        <MacroChart nutrients={nutrients} />
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Calorie Breakdown
        </Typography>
        <CalorieBreakdown nutrients={nutrients} />
      </Box>

      {/* Detailed Breakdown with DV% */}
      <Grid container spacing={4}>
        {[
          { title: 'Vitamins', nutrients: vitamins },
          { title: 'Minerals', nutrients: minerals },
          { title: 'Other Nutrients', nutrients: others }
        ].map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {section.title}
            </Typography>
            {nutrients
              .filter(nutrient => section.nutrients.includes(nutrient.name))
              .map((nutrient) => {
                const dv = calculateDV(nutrient.amount, nutrient.name);
                return (
                  <Box key={nutrient.name} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}>
                    <Typography variant="body2">{nutrient.name}</Typography>
                    <Typography variant="body2">
                      {Math.round(nutrient.amount)}{nutrient.unit}
                      {dv && <span style={{ color: 'text.secondary' }}> ({dv}% DV)</span>}
                    </Typography>
                  </Box>
                );
              })}
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
        *DV = Daily Value based on a 2,000 calorie diet
      </Typography>
    </Paper>
  );
};

const ReviewSection = ({ recipeId }: { recipeId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | ''>('');

  useEffect(() => {
    loadReviews();
  }, [recipeId, sortBy, sortOrder, filterRating]);

  const loadReviews = () => {
    let filteredReviews = getReviews(recipeId);
    
    // Apply rating filter
    if (filterRating !== '') {
      filteredReviews = filteredReviews.filter(r => r.rating === filterRating);
    }

    // Apply sorting
    filteredReviews.sort((a, b) => {
      const compareValue = sortBy === 'date'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : b.rating - a.rating;
      return sortOrder === 'desc' ? compareValue : -compareValue;
    });

    setReviews(filteredReviews);
  };

  const handleSubmitReview = () => {
    if (!newRating || !comment.trim() || !userName.trim()) return;

    if (editingReview) {
      updateReview({
        ...editingReview,
        rating: newRating,
        comment: comment.trim(),
        userName: userName.trim()
      });
      setEditingReview(null);
    } else {
      addReview({
        recipeId,
        userId: 'user-1',
        rating: newRating,
        comment: comment.trim(),
        userName: userName.trim()
      });
    }

    loadReviews();
    setNewRating(null);
    setComment('');
    setUserName('');
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setComment(review.comment);
    setUserName(review.userName);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(recipeId, reviewId);
      loadReviews();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Reviews {reviews.length > 0 && `(${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} ★)`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Filter Rating</InputLabel>
            <Select
              value={filterRating}
              label="Filter Rating"
              onChange={(e) => setFilterRating(e.target.value as number | '')}
            >
              <MenuItem value="">All</MenuItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <MenuItem key={rating} value={rating}>{rating} Stars</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Add Review Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Add a Review</Typography>
        <TextField
          fullWidth
          label="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={newRating}
            onChange={(_, value) => setNewRating(value)}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmitReview}
          disabled={!newRating || !comment.trim() || !userName.trim()}
        >
          Submit Review
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {reviews.length === 0 ? (
        <Typography>No reviews match your criteria.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map((review) => (
            <Box key={review.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2 }}>{review.userName[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {review.userName}
                    {review.edited && (
                      <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                        (edited)
                      </Typography>
                    )}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="caption" sx={{ ml: 'auto' }}>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditReview(review)}
                  sx={{ ml: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteReview(review.id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2">{review.comment}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

const ShareMenu = ({ recipe }: { recipe: RecipeDetails }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const shareUrl = window.location.href;
  const title = `Check out this recipe for ${recipe.title}!`;
  const hashtags = ['recipe', 'cooking', 'food'];

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleShareClick}
        sx={{
          position: 'absolute',
          right: 56, // Position next to favorite button
          top: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
        }}
      >
        <ShareIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <FacebookShareButton 
            url={shareUrl} 
            hashtag="#recipe"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FacebookIcon size={32} round />
              <Typography>Facebook</Typography>
            </Box>
          </FacebookShareButton>
        </MenuItem>

        <MenuItem>
          <TwitterShareButton url={shareUrl} title={title} hashtags={hashtags}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TwitterIcon size={32} round />
              <Typography>Twitter</Typography>
            </Box>
          </TwitterShareButton>
        </MenuItem>

        <MenuItem>
          <WhatsappShareButton url={shareUrl} title={title}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WhatsappIcon size={32} round />
              <Typography>WhatsApp</Typography>
            </Box>
          </WhatsappShareButton>
        </MenuItem>

        <MenuItem>
          <EmailShareButton url={shareUrl} subject={title} body={`Check out this recipe:\n\n${shareUrl}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon size={32} round />
              <Typography>Email</Typography>
            </Box>
          </EmailShareButton>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleCopyLink}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContentCopyIcon />
            <Typography>{copySuccess ? 'Copied!' : 'Copy Link'}</Typography>
          </Box>
        </MenuItem>
      </Menu>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

const ServingAdjuster = ({ 
  originalServings, 
  ingredients,
  onServingsChange 
}: { 
  originalServings: number;
  ingredients: RecipeDetails['extendedIngredients'];
  onServingsChange: (newServings: number, scaledIngredients: RecipeDetails['extendedIngredients']) => void;
}) => {
  const [servings, setServings] = useState(originalServings);

  const handleServingsChange = (newServings: number) => {
    if (newServings < 1) return;
    
    const scaleFactor = newServings / originalServings;
    const scaledIngredients = ingredients.map(ing => ({
      ...ing,
      amount: Number((ing.amount * scaleFactor).toFixed(2))
    }));

    setServings(newServings);
    onServingsChange(newServings, scaledIngredients);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography>Servings:</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          size="small"
          onClick={() => handleServingsChange(servings - 1)}
          disabled={servings <= 1}
        >
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ mx: 2 }}>{servings}</Typography>
        <IconButton 
          size="small"
          onClick={() => handleServingsChange(servings + 1)}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const UnitConverter = ({ 
  amount, 
  unit,
  onConvert
}: { 
  amount: number;
  unit: string;
  onConvert: (newAmount: number, newUnit: string) => void;
}) => {
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const compatibleUnits = getCompatibleUnits(unit);

  const handleUnitChange = (newUnit: string) => {
    const converted = convertUnit(amount, unit, newUnit);
    if (converted !== null) {
      setSelectedUnit(newUnit);
      onConvert(converted, newUnit);
    }
  };

  if (!isConvertibleUnit(unit) || compatibleUnits.length <= 1) {
    return null;
  }

  return (
    <Select
      size="small"
      value={selectedUnit}
      onChange={(e) => handleUnitChange(e.target.value)}
      sx={{ ml: 1, minWidth: 80 }}
    >
      {compatibleUnits.map((u) => (
        <MenuItem key={u} value={u}>
          {u}
        </MenuItem>
      ))}
    </Select>
  );
};

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentServings, setCurrentServings] = useState<number>(0);
  const [scaledIngredients, setScaledIngredients] = useState<RecipeDetails['extendedIngredients']>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printOptions, setPrintOptions] = useState({
    showImage: true,
    showNutrition: true,
    showNotes: false,
    notes: '',
    theme: 'classic',
    cardsPerPage: 1
  });
  const [printFormat, setPrintFormat] = useState<'full' | 'card'>('full');
  const [renderKey, setRenderKey] = useState(0);

  const fetchRecipe = async () => {
    try {
      if (!id) return;
      const data = await getRecipeById(Number(id));
      if (data) {
        setRecipe({
          ...data,
          title: data.title || '',
          image: data.image || '',
          instructions: Array.isArray(data.instructions) 
            ? data.instructions.join('\n') 
            : data.instructions || '',
          summary: data.summary || '',
          nutrition: data.nutrition || {
            nutrients: [],
            healthLabels: []
          }
        });
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setCurrentServings(recipe.servings);
      setScaledIngredients(recipe.extendedIngredients);
    }
  }, [recipe]);

  const handleServingsChange = (newServings: number, newIngredients: RecipeDetails['extendedIngredients']) => {
    setCurrentServings(newServings);
    setScaledIngredients(newIngredients);
  };

  const handleFavoriteClick = () => {
    if (!recipe) return;
    
    try {
      if (isFavorite(recipe.id)) {
        removeFavorite(recipe.id);
        setIsFavorited(false);
      } else {
        saveFavorite(recipe.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // @ts-ignore
  const handlePrint = useReactToPrint({
    documentTitle: recipe?.title || 'Recipe',
    onAfterPrint: () => console.log('Printed successfully'),
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
    content: () => printRef.current,
  });

  const onPrintClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPrintDialogOpen(true);
  };

  const PrintOptionsDialog = () => (
    <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)}>
      <DialogTitle>Print Options</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, pt: 1 }}>
          <FormControl>
            <FormLabel>Print Format</FormLabel>
            <RadioGroup
              value={printFormat}
              onChange={(e) => setPrintFormat(e.target.value as 'full' | 'card')}
            >
              <FormControlLabel value="full" control={<Radio />} label="Full Recipe" />
              <FormControlLabel value="card" control={<Radio />} label="Recipe Card (3x5)" />
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={printOptions.showImage}
                onChange={(e) => setPrintOptions(prev => ({ ...prev, showImage: e.target.checked }))}
              />
            }
            label="Include Recipe Image"
          />
          <FormControlLabel
            control={
              <Switch
                checked={printOptions.showNutrition}
                onChange={(e) => setPrintOptions(prev => ({ ...prev, showNutrition: e.target.checked }))}
              />
            }
            label="Include Nutrition Information"
          />
          {printFormat === 'full' && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={printOptions.showNotes}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, showNotes: e.target.checked }))}
                  />
                }
                label="Include Notes"
              />
              {printOptions.showNotes && (
                <TextField
                  multiline
                  rows={4}
                  label="Recipe Notes"
                  value={printOptions.notes}
                  onChange={(e) => setPrintOptions(prev => ({ ...prev, notes: e.target.value }))}
                  fullWidth
                />
              )}
            </>
          )}
          
          {printFormat === 'card' && (
            <>
              <FormControl>
                <FormLabel>Card Theme</FormLabel>
                <RadioGroup
                  value={printOptions.theme}
                  onChange={(e) => setPrintOptions(prev => ({ 
                    ...prev, 
                    theme: e.target.value 
                  }))}
                >
                  {Object.entries(cardThemes).map(([key, theme]) => (
                    <FormControlLabel 
                      key={key}
                      value={key} 
                      control={<Radio />} 
                      label={theme.name} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Cards per Page</FormLabel>
                <RadioGroup
                  value={printOptions.cardsPerPage}
                  onChange={(e) => setPrintOptions(prev => ({ 
                    ...prev, 
                    cardsPerPage: Number(e.target.value) 
                  }))}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Single Card (5x3)" />
                  <FormControlLabel value={2} control={<Radio />} label="Two Cards (4x2.5)" />
                </RadioGroup>
              </FormControl>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            setPrintDialogOpen(false);
            handlePrint();
          }}
          variant="contained"
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDietLabel = (diet: string) => (
    <Chip
      key={diet}
      label={diet}
      color="primary"
      size="small"
      sx={{ mr: 1, mb: 1 }}
    />
  );

  const renderDiets = () => {
    if (!recipe?.diets?.length) return null;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Diets</Typography>
        <Grid container spacing={1}>
          {recipe.diets.map((diet) => (
            <Grid item key={diet}>
              <Chip label={diet} color="primary" variant="outlined" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const formatInstructions = (instructions: string | string[]): string => {
    if (Array.isArray(instructions)) {
      return instructions.join('\n');
    }
    return instructions;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Container>
        <Typography variant="h5">Recipe not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <IconButton
              onClick={onPrintClick}
              sx={{
                position: 'absolute',
                right: 104,
                top: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
            >
              <PrintIcon />
            </IconButton>
            <ShareMenu recipe={recipe} />
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
          <Box sx={{ mb: 2 }}>
            {renderDiets()}
          </Box>
          <Typography variant="body1" gutterBottom>
            Ready in {recipe.readyInMinutes} minutes | Serves {recipe.servings}
          </Typography>
          <Typography 
            component="div"
            variant="body1" 
            dangerouslySetInnerHTML={{ __html: recipe.summary }} 
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Ingredients</Typography>
            <ServingAdjuster 
              originalServings={recipe.servings}
              ingredients={recipe.extendedIngredients}
              onServingsChange={handleServingsChange}
            />
            <List>
              {scaledIngredients.map((ingredient) => (
                <ListItem key={ingredient.id}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>
                          {decimalToFraction(ingredient.amount)} {ingredient.unit} {ingredient.name}
                        </Typography>
                        <UnitConverter
                          amount={ingredient.amount}
                          unit={ingredient.unit}
                          onConvert={(newAmount, newUnit) => {
                            const updatedIngredient = {
                              ...ingredient,
                              amount: newAmount,
                              unit: newUnit
                            };
                            setScaledIngredients(prev => 
                              prev.map(ing => 
                                ing.id === ingredient.id ? updatedIngredient : ing
                              )
                            );
                          }}
                        />
                      </Box>
                    }
                    secondary={ingredient.original}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Instructions</Typography>
            <Typography 
              component="div"
              variant="body1" 
              dangerouslySetInnerHTML={{ __html: formatInstructions(recipe.instructions) }} 
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Nutrition Information</Typography>
              
            <NutritionAnalysis 
              ingredients={recipe.extendedIngredients} 
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <ReviewSection recipeId={recipe.id} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'none' }}>
        {printFormat === 'full' ? (
          <div ref={printRef}>
            <PrintableRecipe
              recipe={{
                ...recipe,
                instructions: recipe.instructions
              }}
              options={printOptions}
            />
          </div>
        ) : (
          <div ref={printRef}>
            <RecipeCard
              recipe={{
                ...recipe,
                instructions: recipe.instructions
              }}
              options={printOptions}
            />
          </div>
        )}
      </Box>
      <PrintOptionsDialog />
    </Container>
  );
};

export default RecipeDetail;