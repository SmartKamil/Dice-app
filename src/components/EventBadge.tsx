import React from 'react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

interface EventBadgeProps {
  type: 'featured' | 'on_sale';
  saleDate?: string;
}

const EventBadge: React.FC<EventBadgeProps> = ({ type, saleDate }) => {
  const { themeMode } = useTheme();

  if (type === 'featured') {
    return (
      <div className={`absolute bg-[#3C74FF] px-2 py-1 text-white text-sm uppercase tracking-wider font-normal ${
        themeMode === 'v2' 
          ? 'top-4 right-4'
          : 'bottom-4 right-4'
      }`}>
        Featured
      </div>
    );
  }

  if (type === 'on_sale' && saleDate) {
    const formattedDate = format(new Date(saleDate), 'd MMM h:mmaaa').toLowerCase();
    return (
      <div className="absolute bottom-4 right-4 bg-black px-2 py-1 text-white text-sm font-normal">
        On sale {formattedDate}
      </div>
    );
  }

  return null;
};

export default EventBadge;

