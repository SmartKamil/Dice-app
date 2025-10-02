import React, { useState, useEffect, useRef } from 'react';
import { searchVenues } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface VenueSearchProps {
  onSearch: (venueName: string) => void;
  isLoading: boolean;
}

const VenueSearch: React.FC<VenueSearchProps> = ({ onSearch, isLoading }) => {
  const { themeMode } = useTheme();
  const [venueName, setVenueName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (venueName.trim().length >= 2) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setIsLoadingSuggestions(true);
        const venues = await searchVenues(venueName.trim());
        setSuggestions(venues);
        setIsLoadingSuggestions(false);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [venueName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (venueName.trim()) {
      onSearch(venueName.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (venue: string) => {
    setVenueName(venue);
    setShowSuggestions(false);
    onSearch(venue);
  };

  return (
    <div className="w-full mb-8 relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={venueName}
            onChange={(e) => {
              setVenueName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Start typing venue name... (e.g., room, bar)"
            className={`w-full px-4 py-3 border focus:outline-none focus:border-dice-blue text-base transition-colors ${
              themeMode === 'v2'
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white dark:focus:border-dice-blue rounded-lg shadow-sm'
                : 'border-gray-300 bg-white'
            }`}
            disabled={isLoading}
          />
          
          {showSuggestions && venueName.trim().length >= 2 && (
            <div className={`absolute top-full left-0 right-0 mt-1 shadow-lg rounded-md max-h-60 overflow-y-auto z-10 ${
              themeMode === 'v2'
                ? 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                : 'bg-white border border-gray-300'
            }`}>
              {isLoadingSuggestions ? (
                <div className={`px-4 py-3 text-sm ${
                  themeMode === 'v2' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
                }`}>Searching venues...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((venue, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(venue)}
                    className={`w-full text-left px-4 py-3 transition-colors text-base border-b last:border-b-0 cursor-pointer ${
                      themeMode === 'v2'
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white border-gray-100 dark:border-gray-700'
                        : 'hover:bg-gray-100 text-black border-gray-100'
                    }`}
                  >
                    {venue}
                  </button>
                ))
              ) : (
                <div className={`px-4 py-3 text-sm ${
                  themeMode === 'v2' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
                }`}>No venues found. Try different keywords.</div>
              )}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className={`px-8 py-3 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap ${
            themeMode === 'v2' ? 'rounded-lg shadow-md hover:shadow-lg' : ''
          }`}
          disabled={isLoading || !venueName.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {!venueName && (
        <div className="mt-4">
          <p className={`text-sm ${themeMode === 'v2' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'}`}>Start typing to see venue suggestions</p>
        </div>
      )}
    </div>
  );
};

export default VenueSearch;
