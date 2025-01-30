import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
  TextField,
  Typography,
  DialogActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { WeekPlan } from '../../types/Recipe';

interface SavedPlansDialogProps {
  open: boolean;
  onClose: () => void;
  currentPlan: WeekPlan;
  onLoadPlan: (plan: WeekPlan) => void;
}

interface SavedPlan {
  id: string;
  name: string;
  plan: WeekPlan;
  savedAt: string;
  description?: string;
  tags: string[];
  category: string;
}

const STORAGE_KEY = 'savedMealPlans';

const CATEGORIES = ['Regular', 'Keto', 'Vegetarian', 'Vegan', 'Low Carb', 'High Protein'];

const SavedPlansDialog: React.FC<SavedPlansDialogProps> = ({
  open,
  onClose,
  currentPlan,
  onLoadPlan,
}) => {
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('Regular');
  const [newPlanTags, setNewPlanTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    if (!newPlanName.trim()) return;

    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      name: newPlanName.trim(),
      plan: currentPlan,
      savedAt: new Date().toISOString(),
      description: newPlanDesc.trim(),
      tags: newPlanTags,
      category: newPlanCategory,
    };

    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    resetForm();
  };

  const resetForm = () => {
    setNewPlanName('');
    setNewPlanDesc('');
    setNewPlanCategory('Regular');
    setNewPlanTags([]);
    setNewTagInput('');
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !newPlanTags.includes(newTagInput.trim())) {
      setNewPlanTags([...newPlanTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPlanTags(newPlanTags.filter(tag => tag !== tagToRemove));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(savedPlans);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meal-plans.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPlans = JSON.parse(e.target?.result as string);
        setSavedPlans(importedPlans);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedPlans));
      } catch (error) {
        console.error('Error importing plans:', error);
        // You might want to add error handling UI here
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  };

  const handleLoad = (plan: WeekPlan) => {
    onLoadPlan(plan);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Saved Meal Plans
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Save Current Plan
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Plan Name"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
            />
            
            <TextareaAutosize
              minRows={3}
              placeholder="Plan description (optional)"
              value={newPlanDesc}
              onChange={(e) => setNewPlanDesc(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px',
                fontFamily: 'inherit'
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={newPlanCategory}
                label="Category"
                onChange={(e) => setNewPlanCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Add Tags"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {newPlanTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!newPlanName.trim()}
            >
              Save Plan
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2">Saved Plans</Typography>
          <Box>
            <Button
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
            <Button
              component="label"
              startIcon={<FileUploadIcon />}
              size="small"
            >
              Import
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleImport}
              />
            </Button>
          </Box>
        </Box>

        <List>
          {savedPlans.map((plan) => (
            <ListItem
              key={plan.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(plan.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {plan.name}
                    <Chip label={plan.category} size="small" />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {plan.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Saved: {new Date(plan.savedAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
                sx={{ cursor: 'pointer' }}
                onClick={() => handleLoad(plan.plan)}
              />
            </ListItem>
          ))}
          {savedPlans.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No saved plans yet
            </Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedPlansDialog;
