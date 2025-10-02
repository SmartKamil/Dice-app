import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import type { Event } from '../types/event';
import { getOptimizedImageUrl } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import AudioPlayer from './AudioPlayer';
import EventBadge from './EventBadge';
import MoreInfo from './MoreInfo';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const { themeMode } = useTheme();
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

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isTiltEnabled, setIsTiltEnabled] = useState(true);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isTiltEnabled) return;
    
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      x.set(0);
      y.set(0);
      return;
    }
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`w-full max-w-[320px] flex flex-col h-full transition-shadow duration-300 ${
        themeMode === 'v2' 
          ? 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-gray-900/50' 
          : 'bg-white'
      }`}
      style={themeMode === 'v2' ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      } : {}}
      onMouseMove={themeMode === 'v2' ? handleMouseMove : undefined}
      onMouseLeave={themeMode === 'v2' ? handleMouseLeave : undefined}
      whileHover={themeMode === 'v2' ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
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

      <div className={`flex flex-col py-4 flex-shrink-0 ${themeMode === 'v2' ? 'px-4' : ''}`}>
        <div className={`text-base leading-[18px] mb-1 h-[18px] ${themeMode === 'v2' ? 'text-gray-700 dark:text-gray-300' : 'text-black'}`}>{formattedDate}</div>
        <h3 className={`text-[28px] leading-8 font-normal mb-2 break-words line-clamp-2 h-16 ${themeMode === 'v2' ? 'dark:text-white' : 'text-black'}`}>{event.name}</h3>
        <div className={`text-base leading-[18px] font-bold h-[18px] ${themeMode === 'v2' ? 'dark:text-white' : 'text-black'}`}>{event.venue}</div>
        <div className={`text-base leading-[18px] h-[18px] ${themeMode === 'v2' ? 'text-gray-700 dark:text-gray-300' : 'text-black'}`}>{event.location}</div>
      </div>

      <div className="flex-grow">
        <MoreInfo 
          description={event.raw_description} 
          lineup={event.lineup} 
          ticketTypes={event.ticket_types}
          currency={event.currency}
        />
      </div>

      <div className={`flex items-center justify-between gap-4 mt-4 flex-shrink-0 ${themeMode === 'v2' ? 'px-4 pb-4' : ''}`}>
        {isSoldOut ? (
          <button 
            className={`flex-shrink-0 w-[160px] h-10 text-sm uppercase tracking-wider font-normal cursor-not-allowed ${
              themeMode === 'v2' 
                ? 'bg-[#E6E6E6] dark:bg-gray-700 text-black dark:text-gray-400 rounded-lg'
                : 'bg-[#E6E6E6] text-black'
            }`}
            disabled
          >
            Sold out
          </button>
        ) : isOnSale ? (
          <motion.a
            href={event.url || '#'}
            target={event.url ? '_blank' : undefined}
            rel={event.url ? 'noopener noreferrer' : undefined}
            className={`flex-shrink-0 w-[160px] h-10 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 cursor-pointer flex items-center justify-center ${
              themeMode === 'v2' ? 'hover:shadow-lg rounded-lg' : ''
            }`}
            whileHover={themeMode === 'v2' ? { scale: 1.05 } : {}}
            whileTap={themeMode === 'v2' ? { scale: 0.95 } : {}}
          >
            Get reminded
          </motion.a>
        ) : (
          <motion.a
            href={event.url || '#'}
            target={event.url ? '_blank' : undefined}
            rel={event.url ? 'noopener noreferrer' : undefined}
            className={`flex-shrink-0 w-[160px] h-10 bg-[#3C74FF] text-white text-sm uppercase tracking-wider font-normal hover:bg-[#2851CC] active:bg-[#1a3d99] transition-all duration-200 cursor-pointer flex items-center justify-center ${
              themeMode === 'v2' ? 'hover:shadow-lg rounded-lg' : ''
            }`}
            whileHover={themeMode === 'v2' ? { scale: 1.05 } : {}}
            whileTap={themeMode === 'v2' ? { scale: 0.95 } : {}}
          >
            Book now
          </motion.a>
        )}
        
        {formattedPrice && (
          <div className="text-right flex-shrink-0">
            {!isSoldOut && (
              <div className={`text-base leading-[18px] opacity-50 ${themeMode === 'v2' ? 'dark:text-gray-400' : ''}`}>From</div>
            )}
            <div className={`text-[32px] leading-[37px] ${themeMode === 'v2' ? 'dark:text-white' : 'text-black'}`}>{formattedPrice}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;

