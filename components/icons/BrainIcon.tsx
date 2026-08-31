import React from 'react';

interface BrainIconProps {
  size?: number;
  className?: string;
}

export function BrainIcon({ size = 24, className = "" }: BrainIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.5 2C8.11929 2 7 3.11929 7 4.5C7 5.88071 8.11929 7 9.5 7H14.5C15.8807 7 17 5.88071 17 4.5C17 3.11929 15.8807 2 14.5 2H9.5Z"
        fill="currentColor"
      />
      <path
        d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z"
        fill="currentColor"
      />
      <path
        d="M8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10Z"
        fill="currentColor"
      />
      <path
        d="M8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13Z"
        fill="currentColor"
      />
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="14" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}
