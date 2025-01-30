import { v4 as uuidv4 } from 'uuid';

export interface Review {
  id: string;
  recipeId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  edited?: boolean;
}

// Simulate a database with localStorage
const STORAGE_KEY = 'recipe_reviews';

const getStoredReviews = (): Review[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

export const getReviews = (recipeId: number): Review[] => {
  const reviews = getStoredReviews();
  return reviews.filter(review => review.recipeId === recipeId);
};

export const addReview = (review: Omit<Review, 'id' | 'date' | 'edited'>): Review => {
  const reviews = getStoredReviews();
  const newReview: Review = {
    ...review,
    id: uuidv4(),
    date: new Date().toISOString(),
    edited: false
  };
  
  reviews.push(newReview);
  saveReviews(reviews);
  return newReview;
};

export const updateReview = (review: Review): Review => {
  const reviews = getStoredReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  
  if (index !== -1) {
    reviews[index] = {
      ...review,
      edited: true,
      date: new Date().toISOString()
    };
    saveReviews(reviews);
    return reviews[index];
  }
  
  throw new Error('Review not found');
};

export const deleteReview = (recipeId: number, reviewId: string): void => {
  const reviews = getStoredReviews();
  const filteredReviews = reviews.filter(
    review => !(review.recipeId === recipeId && review.id === reviewId)
  );
  saveReviews(filteredReviews);
};
