export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  location: string;
  price?: number;
  currency?: string;
  status: 'available' | 'sold_out' | 'on_sale';
  sale_start_date?: string;
  featured?: boolean;
  images?: {
    square?: string;
    brand?: string;
  };
  apple_music_tracks?: any[];
  spotify_tracks?: any[];
  raw_description?: string;
  lineup?: string[];
  url?: string;
  checksum?: string;
  ticket_types?: any[];
}

export interface DiceEvent {
  id: string;
  name: string;
  date: string;
  event_images?: {
    square?: string;
    brand?: string;
    landscape?: string;
  };
  venues?: Array<{
    name: string;
    city?: string;
    country?: string;
  }>;
  sale_start_date?: string;
  sale_end_date?: string;
  raw_description?: string;
  lineup?: string[];
  ticket_types?: Array<{
    name: string;
    price: number;
    currency: string;
    status: string;
  }>;
  apple_music_tracks?: any[];
  spotify_tracks?: any[];
  url?: string;
  checksum?: string;
}

export interface ApiResponse {
  data: DiceEvent[];
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
}

