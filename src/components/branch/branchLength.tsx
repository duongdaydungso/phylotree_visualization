import React from "react";

function BranchLength({ x, y, len }: { x: number; y: number; len: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="start"
      alignmentBaseline="middle"
      className="rp-label"
    >
      {len}
    </text>
  );
}

export default BranchLength;
