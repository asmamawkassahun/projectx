import * as React from "react";

interface ArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const ArrowDownIcon: React.FC<ArrowDownIconProps> = ({
  color = "#000000",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    fill="none"
    viewBox="0 0 14 16"
    {...props}
  >
    <path
      fill={color}
      d="m12.248 8.063-4.224 4.452V1.08C8.024.484 7.564 0 6.999 0c-.566 0-1.025.484-1.025 1.08v11.435L1.75 8.064a.987.987 0 0 0-1.45 0 1.12 1.12 0 0 0 0 1.527l5.799 6.11c.246.26.582.34.901.28a.98.98 0 0 0 .901-.28l5.798-6.11c.401-.422.401-1.106 0-1.527a.99.99 0 0 0-1.451-.001"
    />
  </svg>
);

export default ArrowDownIcon;
