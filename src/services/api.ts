import axios from 'axios';
import type { ApiResponse, Event } from '../types/event';

const API_BASE_URL = 'https://events-api.dice.fm/v1/events';
const API_KEY = 'dHmvC0ZXzF4h1mWldfur13c6s4Ix6wCF4OTzozXC';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export const fetchEvents = async (
  venueName: string,
  pageSize: number = 12
): Promise<ApiResponse> => {
  const response = await apiClient.get('', {
    params: {
      'filter[venues]': venueName,
      'page[size]': pageSize,
    },
  });
  return response.data;
};

export const searchVenues = async (query: string): Promise<string[]> => {
  try {
    const response = await apiClient.get('', {
      params: {
        'page[size]': 100,
      },
    });
    
    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    
    const venueSet = new Set<string>();
    response.data.data.forEach((event: any) => {
      if (event.venues && event.venues.length > 0) {
        event.venues.forEach((venue: any) => {
          if (venue.name) {
            venueSet.add(venue.name);
          }
        });
      }
    });
    
    const allVenues = Array.from(venueSet);
    const lowerQuery = query.toLowerCase();
    
    const matchedVenues = allVenues.filter(venue => 
      venue.toLowerCase().includes(lowerQuery)
    );
    
    return matchedVenues.slice(0, 10);
  } catch (error) {
    return [];
  }
};

export const fetchMoreEvents = async (
  venueName: string,
  pageNumber: number,
  pageSize: number = 12
): Promise<ApiResponse> => {
  const response = await apiClient.get('', {
    params: {
      'filter[venues]': venueName,
      'page[size]': pageSize,
      'page[number]': pageNumber,
    },
  });
  return response.data;
};

export const transformDiceEvent = (diceEvent: any): Event => {
  // Handle venue data
  let venueName = diceEvent.venue || 'Unknown Venue';
  let venueLocation = 'Unknown Location';
  
  // Get location from venues array or location object
  if (diceEvent.venues && diceEvent.venues.length > 0) {
    const venue = diceEvent.venues[0];
    venueName = venue.name || venueName;
    
    if (venue.city?.name && venue.city?.country_name) {
      venueLocation = `${venue.city.name}, ${venue.city.country_name}`;
    }
  } else if (diceEvent.location) {
    const city = diceEvent.location.city || '';
    const country = diceEvent.location.country || '';
    if (city || country) {
      venueLocation = [city, country].filter(Boolean).join(', ');
    }
  }

  // Handle ticket/price data
  let price: number | undefined;
  let currency = '£';
  let ticketTypes: any[] = [];

  // Get currency from event level or convert GBP to symbol
  if (diceEvent.currency) {
    currency = diceEvent.currency === 'GBP' ? '£' : 
                diceEvent.currency === 'USD' ? '$' : 
                diceEvent.currency === 'EUR' ? '€' : 
                diceEvent.currency;
  }

  if (diceEvent.ticket_types && diceEvent.ticket_types.length > 0) {
    ticketTypes = diceEvent.ticket_types;
    const firstTicket = diceEvent.ticket_types[0];
    
    // Price is in pence/cents, divide by 100
    if (firstTicket.price?.face_value) {
      price = firstTicket.price.face_value / 100;
    } else if (firstTicket.price?.total) {
      price = firstTicket.price.total / 100;
    }
  }

  // Determine status based on API fields
  let status: 'available' | 'sold_out' | 'on_sale' = 'available';
  
  // Check if sold out first
  if (diceEvent.sold_out === true) {
    status = 'sold_out';
  } else {
    // Check if sale starts in the future
    const now = new Date();
    const saleStartDate = diceEvent.sale_start_date ? new Date(diceEvent.sale_start_date) : null;
    
    if (saleStartDate && saleStartDate > now) {
      // Sale hasn't started yet - show "Get Reminded"
      status = 'on_sale';
    } else if (diceEvent.status === 'on-sale') {
      // Sale is currently active - show "Book Now"
      status = 'available';
    } else {
      // Default to available
      status = 'available';
    }
  }

  // Parse lineup - could be array of objects with time/details
  let lineupArray: string[] = [];
  if (diceEvent.lineup && Array.isArray(diceEvent.lineup)) {
    lineupArray = diceEvent.lineup.map((item: any) => {
      if (typeof item === 'string') return item;
      if (item.details) return item.time ? `${item.details} — ${item.time}` : item.details;
      return '';
    }).filter(Boolean);
  }

  // Add artists to lineup if available
  if (diceEvent.artists && Array.isArray(diceEvent.artists)) {
    const artistNames = diceEvent.artists.map((a: any) => a.name || a).filter(Boolean);
    lineupArray = [...lineupArray, ...artistNames];
  }

  return {
    id: diceEvent.id || '',
    name: diceEvent.name || 'Untitled Event',
    date: diceEvent.date || '',
    venue: venueName,
    location: venueLocation,
    price,
    currency,
    status,
    sale_start_date: diceEvent.sale_start_date,
    featured: diceEvent.featured || false,
    images: {
      square: diceEvent.event_images?.square,
      brand: diceEvent.event_images?.brand || diceEvent.event_images?.landscape,
    },
    apple_music_tracks: diceEvent.apple_music_tracks,
    spotify_tracks: diceEvent.spotify_tracks,
    raw_description: diceEvent.raw_description || diceEvent.description,
    lineup: lineupArray.length > 0 ? lineupArray : undefined,
    url: diceEvent.url,
    checksum: diceEvent.checksum,
    ticket_types: ticketTypes,
  };
};

// Imgix image optimization
export const getOptimizedImageUrl = (url: string | undefined, width: number, height?: number): string => {
  if (!url) return '';
  
  const params = new URLSearchParams({
    w: width.toString(),
    fit: 'crop',
    auto: 'format,compress',
  });
  
  if (height) {
    params.append('h', height.toString());
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
};

