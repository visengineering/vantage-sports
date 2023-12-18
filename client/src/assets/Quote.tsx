import React from 'react';
// Note from Mateusz:
// Historically in this codebase SVG were imported using IMG tag.
// This is not really that flexible and is not following
// recommended practices from React Team.
// We should import SVG files as components like:
// import Quote from 'quote.svg';
// frankly this is not possible with current SVG declaration.
// Hence this workaround:
export const QuoteSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    x="0"
    y="0"
    viewBox="0 0 508.044 508.044"
  >
    <g transform="matrix(-1,0,0,-1,508.0449981689453,508.0448303222656)">
      <path
        d="M0.108,352.536c0,66.794,54.144,120.938,120.937,120.938c66.794,0,120.938-54.144,120.938-120.938    s-54.144-120.937-120.938-120.937c-13.727,0-26.867,2.393-39.168,6.61C109.093,82.118,230.814-18.543,117.979,64.303    C-7.138,156.17-0.026,348.84,0.114,352.371C0.114,352.426,0.108,352.475,0.108,352.536z"
        fill="#ffffff"
      ></path>
      <path
        d="M266.169,352.536c0,66.794,54.144,120.938,120.938,120.938s120.938-54.144,120.938-120.938S453.9,231.599,387.106,231.599    c-13.728,0-26.867,2.393-39.168,6.61C375.154,82.118,496.875-18.543,384.04,64.303C258.923,156.17,266.034,348.84,266.175,352.371    C266.175,352.426,266.169,352.475,266.169,352.536z"
        fill="#ffffff"
      ></path>
    </g>
  </svg>
);
