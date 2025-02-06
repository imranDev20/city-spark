import * as React from "react";

interface KitchenAndTilesIconProps extends React.SVGProps<SVGSVGElement> {}

const KitchenAndTilesIcon: React.FC<KitchenAndTilesIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={512}
    height={512}
    x={0}
    y={0}
    viewBox="0 0 64 64"
    xmlSpace="preserve"
    className=""
    {...props}
  >
    <g>
      <path
        d="M.25 62A1.749 1.749 0 0 0 2 63.75h14.25v-28h-16zM47.75 63.75H62A1.749 1.749 0 0 0 63.75 62V35.75h-16zM19.75 35.75h24.5V48h-24.5zM19.75 51.5h24.5v12.25h-24.5zM62 24.75H2A1.751 1.751 0 0 0 .25 26.5v5.75h63.5V26.5A1.751 1.751 0 0 0 62 24.75zM24 8.75A1.75 1.75 0 0 0 25.75 7V6a2.25 2.25 0 0 1 4.5 0v15.25h3.5V6a5.75 5.75 0 0 0-11.5 0v1A1.75 1.75 0 0 0 24 8.75zM15 18.75h1.25v2.5h3.5v-2.5H21a1.75 1.75 0 0 0 0-3.5h-6a1.75 1.75 0 0 0 0 3.5zM43 18.75h1.25v2.5h3.5v-2.5H49a1.75 1.75 0 0 0 0-3.5h-6a1.75 1.75 0 0 0 0 3.5z"
        opacity={1}
        data-original="#000000"
        className=""
      />
    </g>
  </svg>
);
export default KitchenAndTilesIcon;
