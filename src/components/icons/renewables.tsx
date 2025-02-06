import React from "react";

interface RenewablesIconProps extends React.SVGProps<SVGSVGElement> {}

const RenewablesIcon: React.FC<RenewablesIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={512}
    height={512}
    x={0}
    y={0}
    viewBox="0 0 100 100"
    xmlSpace="preserve"
    className=""
    {...props}
  >
    <g>
      <path
        d="M80.277 13.322H62.735l1.638 17.109H87.94l-5.374-15.494a2.42 2.42 0 0 0-2.289-1.615zM4.904 60.72h27.855l2.434-25.47h-24.82L2.64 57.515c-.265.723-.145 1.542.313 2.193a2.398 2.398 0 0 0 1.952 1.012zM57.892 13.322H42.108l-1.614 17.109h19.012zM95.096 60.72c.771 0 1.518-.386 1.952-1.012.458-.651.578-1.47.313-2.193L89.626 35.25H64.831l2.41 25.47zM37.265 13.322H19.723a2.42 2.42 0 0 0-2.29 1.615L12.06 30.43h23.59zM59.964 35.25H40.036l-2.434 25.47h24.796zM43.407 65.539v16.32H32.952c-1.325 0-2.41 1.084-2.41 2.41s1.085 2.409 2.41 2.409h34.096c1.325 0 2.41-1.085 2.41-2.41s-1.085-2.41-2.41-2.41H56.593v-16.32z"
        opacity={1}
        data-original="#000000"
      />
    </g>
  </svg>
);
export default RenewablesIcon;
