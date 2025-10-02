import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface MoreInfoProps {
  description?: string;
  lineup?: string[];
  ticketTypes?: any[];
  currency?: string;
}

const MoreInfo: React.FC<MoreInfoProps> = ({ description, lineup, ticketTypes, currency = '£' }) => {
  const { themeMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description && (!lineup || lineup.length === 0) && (!ticketTypes || ticketTypes.length === 0)) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors duration-200 cursor-pointer ${
          themeMode === 'v2'
            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <span className={`text-base font-normal ${themeMode === 'v2' ? 'dark:text-white' : 'text-black'}`}>More info</span>
        <div className="w-6 h-6 flex items-center justify-center">
          <div className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-45' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="11" y="5" width="2" height="14" className={themeMode === 'v2' ? 'fill-black dark:fill-white' : 'fill-black'}/>
              <rect x="5" y="11" width="14" height="2" className={themeMode === 'v2' ? 'fill-black dark:fill-white' : 'fill-black'}/>
            </svg>
          </div>
        </div>
      </button>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-4 py-6 ${
            themeMode === 'v2' 
              ? 'bg-[#F2F2F2] dark:bg-gray-700/50' 
              : 'bg-[#F2F2F2]'
          }`}>
          {description && (
            <p className={`text-base leading-5 mb-6 ${themeMode === 'v2' ? 'dark:text-gray-300' : 'text-black'}`}>
              <span className="hidden md:inline">{description}</span>
              <span className="md:hidden">{isExpanded ? description : truncateText(description, 100)}</span>
            </p>
          )}
          
          {lineup && lineup.length > 0 && (
            <div className="mb-6">
              <h4 className={`text-sm uppercase tracking-[0.05em] mb-3 font-normal leading-4 ${
                themeMode === 'v2' ? 'text-[#3C74FF] dark:text-[#6B9AFF]' : 'text-[#3C74FF]'
              }`}>Line up</h4>
              <div className={`text-base leading-[18px] ${themeMode === 'v2' ? 'dark:text-gray-300' : 'text-black'}`}>
                {lineup.map((item, index) => (
                  <div key={index} className="mb-1">{item}</div>
                ))}
              </div>
            </div>
          )}

          {ticketTypes && ticketTypes.length > 0 && (
            <div>
              <h4 className={`text-sm uppercase tracking-[0.05em] mb-3 font-normal leading-4 ${
                themeMode === 'v2' ? 'text-[#3C74FF] dark:text-[#6B9AFF]' : 'text-[#3C74FF]'
              }`}>Tickets</h4>
              <div>
                {ticketTypes.map((ticket, index) => {
                  const price = ticket.price?.face_value ? ticket.price.face_value / 100 : null;
                  const isSoldOut = ticket.sold_out;
                  
                  return (
                    <div key={index} className={`text-base leading-[18px] mb-1 ${themeMode === 'v2' ? 'dark:text-gray-300' : 'text-black'}`}>
                      <div className="flex items-baseline gap-2">
                        <span>{ticket.name} — {price && `${currency}${price.toFixed(2)}`}</span>
                        {isSoldOut && (
                          <span className="text-sm uppercase tracking-[0.05em] opacity-50">
                            Sold out
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;

