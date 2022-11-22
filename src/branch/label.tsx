import React from "react";

function Label({
  branch_x,
  text_x,
  y,
  all_label_styles,
  node_name,
}: {
  branch_x: number;
  text_x: number;
  y: number;
  all_label_styles: any;
  node_name: string;
}) {
  return (
    <>
      <line
        x1={branch_x}
        x2={text_x}
        y1={y}
        y2={y}
        className="rp-branch-tracer"
      />
      <text
        x={text_x + 20}
        y={y}
        textAnchor="start"
        alignmentBaseline="middle"
        {...all_label_styles}
        className="rp-label"
      >
        {node_name}
      </text>
    </>
  );
}

export default Label;
