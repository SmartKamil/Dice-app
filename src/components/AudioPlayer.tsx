import React, { useState, useRef, useEffect } from 'react';
import AudioManager from '../utils/audioManager';

interface AudioPlayerProps {
  audioUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioUrl]);

  useEffect(() => {
    const checkIfPaused = () => {
      if (audioRef.current && audioManager.getCurrentAudio() !== audioRef.current) {
        setIsPlaying(false);
      }
    };

    const interval = setInterval(checkIfPaused, 100);
    return () => clearInterval(interval);
  }, [audioManager]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!audioUrl) {
      console.log('No audio preview available');
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = 0.7;
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', () => {
        console.error('Error loading audio');
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioManager.setCurrentAudio(audioRef.current);
      
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-0 left-0 w-12 h-12 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
      aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
    >
      {isPlaying ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="5" y="4" width="3" height="12" fill="white" rx="1" />
          <rect x="12" y="4" width="3" height="12" fill="white" rx="1" />
        </svg>
      ) : (
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
      )}
    </button>
  );
};

export default AudioPlayer;

