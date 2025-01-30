import React, { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;