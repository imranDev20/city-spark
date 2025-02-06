interface PlumbingIconProps extends React.SVGProps<SVGSVGElement> {}

const PlumbingIcon: React.FC<PlumbingIconProps> = (props) => (
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
        d="M226 151h60v210h-60zM482 422V286c0-57.891-48.109-105-106-105h-60v150h45v91zM30 60h121V30h30V0H0v30h30zM482 452H361v30h-30v30h181v-30h-30zM30 90v136c0 57.891 48.109 105 106 105h60V181h-45V90z"
        opacity={1}
        data-original="#000000"
      />
    </g>
  </svg>
);
export default PlumbingIcon;
