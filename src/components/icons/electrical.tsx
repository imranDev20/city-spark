import * as React from "react";

interface ElectricalIconProps extends React.SVGProps<SVGSVGElement> {}

const ElectricalIcon: React.FC<ElectricalIconProps> = (props) => (
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
        d="M406 92h-45V15c0-8.284-6.716-15-15-15s-15 6.716-15 15v77H181V15c0-8.284-6.716-15-15-15s-15 6.716-15 15v77h-45c-8.28 0-15 6.72-15 15v60c0 8.28 6.72 15 15 15h15v75c0 69.63 52.98 127.11 120.75 134.25h.002C248.894 459.016 306.373 512 376 512c8.284 0 15-6.716 15-15s-6.716-15-15-15c-53.13 0-97.163-39.667-104.056-90.939h.006C338.9 383.15 391 326.04 391 257v-75h15c8.28 0 15-6.72 15-15v-60c0-8.28-6.72-15-15-15zM296.61 267.61l-30 30c-13.91 13.91-35.27-7.16-21.22-21.22l15.29-15.28-41.39-20.69c-9.14-4.58-11.13-16.79-3.9-24.03l30-30c14.02-14.02 35.26 7.17 21.22 21.22l-15.29 15.28 41.39 20.69c9.14 4.58 11.13 16.79 3.9 24.03z"
        opacity={1}
        data-original="#000000"
        className=""
      />
    </g>
  </svg>
);
export default ElectricalIcon;
