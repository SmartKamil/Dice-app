import React from 'react';
import { format } from 'date-fns';
import type { Event } from '../types/event';
import { getOptimizedImageUrl } from '../services/api';
import AudioPlayer from './AudioPlayer';
import EventBadge from './EventBadge';
import MoreInfo from './MoreInfo';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const hasAudioTracks = 
    (event.apple_music_tracks && event.apple_music_tracks.length > 0) ||
    (event.spotify_tracks && event.spotify_tracks.length > 0);

  const isOnSale = event.status === 'on_sale';
  const isSoldOut = event.status === 'sold_out';
  const isFeatured = event.featured;
  
  const imageHeight = 320;
  const imageUrl = getOptimizedImageUrl(event.images?.square || event.images?.brand, 320, imageHeight);

  const formattedDate = event.date 
    ? format(new Date(event.date), 'EEE d MMM — h:mmaaa').replace('AM', 'am').replace('PM', 'pm')
    : '';

  const formattedPrice = event.price 
    ? `${event.currency}${event.price.toFixed(2)}`
    : '';

  return (
    <div className="w-full max-w-[320px] flex flex-col h-full">
      <div className="relative w-full overflow-hidden flex-shrink-0 aspect-square md:aspect-auto md:h-[320px]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        
        {hasAudioTracks && (
          <AudioPlayer 
            audioUrl={
              event.apple_music_tracks?.[0]?.preview_url || 
              event.spotify_tracks?.[0]?.preview_url
            }
          />
        )}
        
        {isFeatured && <EventBadge type="featured" />}
        {!isFeatured && isOnSale && <EventBadge type="on_sale" saleDate={event.sale_start_date} />}
      </div>

      <div className="flex flex-col py-4 flex-shrink-0">
        <div className="text-base leading-[18px] mb-1 h-[18px]">{formattedDate}</div>
        <h3 className="text-[28px] leading-8 font-normal mb-2 break-words line-clamp-2 h-16">{event.name}</h3>
        <div className="text-base leading-[18px] font-bold h-[18px]">{event.venue}</div>
        <div className="text-base leading-[18px] h-[18px]">{event.location}</div>
      </div>

      <div className="flex-grow">
        <MoreInfo 
          description={event.raw_description} 
          lineup={event.lineup} 
          ticketTypes={event.ticket_types}
          currency={event.currency}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 flex-shrink-0">
        {isSoldOut ? (
          <button 
            className="flex-shrink-0 w-[160px] h-10 bg-[#E6E6E6] text-black text-sm uppercase tracking-wider font-normal cursor-not-allowed"
            disabled
          >
            Sold out
          </button>
        ) : isOnSale ? (
          <button className="flex-shrink-0 w-[160px] h-10 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 hover:shadow-lg">
            Get reminded
          </button>
        ) : (
          <button className="flex-shrink-0 w-[160px] h-10 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 hover:shadow-lg">
            Book now
          </button>
        )}
        
        {formattedPrice && (
          <div className="text-right flex-shrink-0">
            {!isSoldOut && (
              <div className="text-base leading-[18px] opacity-50">From</div>
            )}
            <div className="text-[32px] leading-[37px]">{formattedPrice}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

