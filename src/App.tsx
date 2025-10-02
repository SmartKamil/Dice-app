import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import VenueSearch from './components/VenueSearch';
import EventCard from './components/EventCard';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import { fetchEvents, fetchMoreEvents, transformDiceEvent } from './services/api';
import type { Event } from './types/event';

function App() {
  const { themeMode } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVenue, setCurrentVenue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (venueName: string) => {
    setIsLoading(true);
    setError(null);
    setEvents([]);
    setCurrentVenue(venueName);
    setCurrentPage(1);

    try {
      const response = await fetchEvents(venueName, 12);
      
      if (!response.data || response.data.length === 0) {
        setError(`No events found for "${venueName}". Try a different venue name.`);
        setEvents([]);
        setHasMore(false);
        return;
      }
      
      const transformedEvents = response.data.map(transformDiceEvent);
      setEvents(transformedEvents);
      
      setHasMore(!!response.links?.next);
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 400) {
        setError(`No events found for "${venueName}". Try a different venue.`);
      } else {
        setError('Failed to fetch events. Please try again.');
      }
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!currentVenue || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await fetchMoreEvents(currentVenue, nextPage, 12);
      const transformedEvents = response.data.map(transformDiceEvent);
      
      setEvents(prev => [...prev, ...transformedEvents]);
      setCurrentPage(nextPage);
      
      setHasMore(!!response.links?.next);
    } catch (err) {
      setError('Failed to load more events. Please try again.');
      console.error('Error loading more events:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentVenue, currentPage, isLoadingMore, hasMore, events.length]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, handleLoadMore]);

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 md:px-8 lg:px-12 transition-colors duration-300 ${
      themeMode === 'v2' 
        ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800' 
        : 'bg-white'
    }`}>
      <ThemeToggle />
      
      <div className="max-w-[1280px] mx-auto">
        {themeMode === 'v2' ? (
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#3C74FF] to-[#8B5CF6] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Amazing Events
          </motion.h1>
        ) : (
          <h1 className="text-2xl leading-7 mb-8 text-black">
            Upcoming events at Venue
          </h1>
        )}

        <VenueSearch onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <motion.div 
            className="text-red-600 dark:text-red-400 text-center mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
          </motion.div>
        )}

        {!isLoading && events.length === 0 && currentVenue && !error && (
          <motion.div 
            className="text-center py-12 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No events found for "{currentVenue}".
          </motion.div>
        )}

        {!isLoading && events.length === 0 && !currentVenue && (
          <motion.div 
            className="text-center py-12 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Enter a venue name to see events
          </motion.div>
        )}

        {events.length > 0 && (
          <>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 justify-items-center sm:justify-items-start items-start perspective"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <EventCard 
                    event={event}
                  />
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div 
                ref={loadMoreRef}
                className="flex justify-center mt-12 py-8"
              >
                {isLoadingMore && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-dice-blue"></div>
                    <p className="text-gray-600">Loading more events...</p>
                  </div>
                )}
              </div>
            )}

            {!hasMore && events.length > 12 && (
              <motion.div 
                className="text-center mt-12 py-8 text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>You've reached the end of the list</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
