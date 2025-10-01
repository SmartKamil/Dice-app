import React from 'react';

interface PlayButtonProps {
  onClick?: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onClick) {
      onClick();
    } else {
      // Default behavior: show alert or console log
      console.log('Play button clicked - audio track playback would start here');
      // In a real implementation, this would play the audio track
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 left-4 w-12 h-12 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Play audio preview"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-0.5"
      >
        <path
          d="M6 4l10 6-10 6V4z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default PlayButton;

