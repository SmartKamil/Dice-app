import React, { useState, useEffect, useRef } from 'react';
import { searchVenues } from '../services/api';

interface VenueSearchProps {
  onSearch: (venueName: string) => void;
  isLoading: boolean;
}

const VenueSearch: React.FC<VenueSearchProps> = ({ onSearch, isLoading }) => {
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
            placeholder="Start typing venue name... (e.g., waiting, fabric)"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dice-blue text-base"
            disabled={isLoading}
          />
          
          {showSuggestions && venueName.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg rounded-md max-h-60 overflow-y-auto z-10">
              {isLoadingSuggestions ? (
                <div className="px-4 py-3 text-gray-500 text-sm">Searching venues...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((venue, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(venue)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-base border-b border-gray-100 last:border-b-0"
                  >
                    {venue}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">No venues found. Try different keywords.</div>
              )}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="px-8 py-3 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
          disabled={isLoading || !venueName.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {!venueName && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Start typing to see venue suggestions</p>
        </div>
      )}
    </div>
  );
};

export default VenueSearch;
