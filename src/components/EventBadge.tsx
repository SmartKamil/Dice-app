import React from 'react';
import { format } from 'date-fns';

interface EventBadgeProps {
  type: 'featured' | 'on_sale';
  saleDate?: string;
}

const EventBadge: React.FC<EventBadgeProps> = ({ type, saleDate }) => {
  if (type === 'featured') {
    return (
      <div className="absolute top-4 right-4 bg-dice-blue px-2 py-1 text-white text-sm uppercase tracking-wider font-normal">
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

