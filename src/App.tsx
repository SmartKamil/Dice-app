import { useState, useEffect, useRef, useCallback } from 'react';
import VenueSearch from './components/VenueSearch';
import EventCard from './components/EventCard';
import { fetchEvents, fetchMoreEvents, transformDiceEvent } from './services/api';
import type { Event } from './types/event';

function App() {
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl leading-7 mb-8">
          Upcoming events at Venue
        </h1>

        <VenueSearch onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="text-red-600 text-center mb-4 p-4 bg-red-50">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        )}

        {!isLoading && events.length === 0 && currentVenue && !error && (
          <div className="text-center py-12 text-gray-600">
            No events found for "{currentVenue}".
          </div>
        )}

        {!isLoading && events.length === 0 && !currentVenue && (
          <div className="text-center py-12 text-gray-600">
            Enter a venue name to see events
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 justify-items-center sm:justify-items-start items-start">
              {events.map((event, index) => (
                <EventCard 
                  key={`${event.id}-${index}`} 
                  event={event}
                />
              ))}
            </div>

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
              <div className="text-center mt-12 py-8 text-gray-600">
                <p>You've reached the end of the list</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
