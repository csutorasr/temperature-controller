import React from 'react';

export const Triangle = function ({
  direction,
}: {
  direction?: 'up' | 'down';
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="79"
      height="79"
      style={direction === 'down' ? { transform: 'rotate(180deg)' } : {}}
    >
      <path
        stroke="none"
        fill="#FFFFFF88"
        d="M26.509618943233 11.198729810778a15 15 0 0 1 25.980762113533 0l24.019237886467 41.602540378444a15 15 0 0 1 -12.990381056767 22.5l-48.038475772934 0a15 15 0 0 1 -12.990381056767 -22.5"
      ></path>
    </svg>
  );
};

export default Triangle;
