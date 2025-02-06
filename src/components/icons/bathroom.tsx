import React from "react";

interface BathroomIconProps extends React.SVGProps<SVGSVGElement> {}

const BathroomIcon: React.FC<BathroomIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={512}
    height={512}
    x={0}
    y={0}
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    className=""
    {...props}
  >
    <g>
      <path
        d="M482 180H242c-16.538 0-30 13.462-30 30v30h270c16.538 0 30-13.462 30-30s-13.462-30-30-30z"
        opacity={1}
        data-original="#000000"
      />
      <path
        d="M482 270H182V0H0l33.758 270H92c0 100.865 88.498 136.658 90 137.71V482h-60v30h330v-30h-60v-74.29c3.002-2.702 90-35.679 90-137.71zM92 60h30v60H92z"
        opacity={1}
        data-original="#000000"
      />
    </g>
  </svg>
);
export default BathroomIcon;
