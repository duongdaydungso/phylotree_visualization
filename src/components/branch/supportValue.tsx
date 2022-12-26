import React from "react";

function SupportValue({
  x,
  y,
  supportValue,
  tempNameArray,
}: {
  x: number;
  y: number;
  supportValue: any;
  tempNameArray: any;
}) {
  let firstEle = true;

  return (
    <text
      x={x}
      y={y}
      textAnchor="start"
      alignmentBaseline="middle"
      className="rp-label"
    >
      {supportValue.map((spVL: any) => {
        if (spVL.isShowing && tempNameArray[spVL.index] !== undefined) {
          const res = `${tempNameArray[spVL.index]}`;

          if (firstEle) {
            firstEle = false;

            return res;
          } else return "/" + res;
        }

        return null;
      })}
    </text>
  );
}

export default SupportValue;
