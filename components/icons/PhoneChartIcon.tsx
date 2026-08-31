import React from 'react';

interface PhoneChartIconProps {
  size?: number;
  className?: string;
}

export function PhoneChartIcon({ size = 24, className = "" }: PhoneChartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Phone base */}
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="7"
        y="4"
        width="10"
        height="12"
        rx="1"
        ry="1"
        fill="currentColor"
        opacity="0.3"
      />
      
      {/* Chart lines */}
      <path
        d="M9 8L11 6L13 8L15 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="9" cy="8" r="1" fill="currentColor" />
      <circle cx="11" cy="6" r="1" fill="currentColor" />
      <circle cx="13" cy="8" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      
      {/* Home button */}
      <rect
        x="10"
        y="18"
        width="4"
        height="2"
        rx="1"
        ry="1"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
