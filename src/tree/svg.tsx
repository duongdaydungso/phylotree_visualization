import React, { FunctionComponent } from "react";

export interface ISVGProps {
  id?: string;
  width?: number;
  height?: number;
  borderStyle?: string;
  borderWidth?: number;
  borderColor?: string;
  children: JSX.Element;
}

const SVG: FunctionComponent<ISVGProps> = (props) => {
  const {
    id = "svg-chart",
    width = 500,
    height = 500,
    borderStyle = "solid",
    borderWidth = 1,
    borderColor = "lightgrey",
    children,
  } = props;

  return (
    <svg
      id={id}
      width={width}
      height={height}
      style={{
        borderStyle: borderStyle,
        borderWidth: borderWidth,
        borderColor: borderColor,
      }}
    >
      {children}
    </svg>
  );
};

export default SVG;
