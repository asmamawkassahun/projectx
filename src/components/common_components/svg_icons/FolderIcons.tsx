import * as React from "react";

interface FolderIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const FolderIcon = ({ color = "#000000", ...props }: FolderIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <path
      fill={color}
      d="M15.167 5.087a1.835 1.835 0 0 0-1.834-1.833H7.277a1.84 1.84 0 0 0-1.6-.951h-3.01A1.835 1.835 0 0 0 .832 4.134v7.733A1.836 1.836 0 0 0 2.667 13.7h10.666a1.835 1.835 0 0 0 1.834-1.834V5.087m-1.834-.833a.834.834 0 0 1 .834.833v.31H8.804a.84.84 0 0 1-.758-.487l-.3-.656zm.835 7.613a.834.834 0 0 1-.835.832H2.667a.834.834 0 0 1-.834-.834v-7.73a.835.835 0 0 1 .834-.832h3.008a.84.84 0 0 1 .758.486l.704 1.537a1.84 1.84 0 0 0 1.667 1.07h5.364z"
    ></path>
  </svg>
);

export default FolderIcon;
