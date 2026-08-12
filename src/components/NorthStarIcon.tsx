import React from 'react';

interface NorthStarIconProps {
  className?: string;
}

export const NorthStarIcon: React.FC<NorthStarIconProps> = ({ className = 'w-4 h-4 text-indigo-400' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* 4 Main Points */}
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2Z" />
      {/* Subtle Inner Diagonal Star Accent */}
      <path d="M12 6.5L12.9 9.9L16.3 10.8L12.9 11.7L12 15.1L11.1 11.7L7.7 10.8L11.1 9.9Z" opacity="0.6" fill="#ffffff" />
    </svg>
  );
};
