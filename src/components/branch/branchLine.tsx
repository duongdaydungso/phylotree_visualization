import React from "react";

import { line } from "d3-shape";

function BranchLine({
  source_x,
  source_y,
  target_x,
  target_y,
  metadata,
  all_branch_styles,
  data,
  tooltip,
  setTooltip,
  onBranchClick,
}: {
  source_x: number;
  source_y: number;
  target_x: number;
  target_y: number;
  metadata?: Object;
  all_branch_styles: any;
  data: any;
  tooltip?: any;
  setTooltip?: any;
  onBranchClick?: any;
}) {
  const linePoint: [number, number][] = [
    [source_x, source_y],
    [source_x, target_y],
    [target_x, target_y],
  ];

  const branch_line: any = line()
    .x((d: [number, number]) => d[0])
    .y((d: [number, number]) => d[1]);

  return (
    <path
      className="rp-branch"
      fill="none"
      d={branch_line(linePoint)}
      {...all_branch_styles}
      onMouseMove={(e) => {
        if (setTooltip)
          setTooltip({
            x: e.clientX,
            y: e.clientY,
            node: data,
            metadata: metadata ? metadata : null,
          });
      }}
      onMouseOut={(e) => {
        if (setTooltip) setTooltip(false);
      }}
      onClick={(e) => {
        onBranchClick({
          x: e.clientX,
          y: e.clientY,
          node: data,
          metadata: metadata ? metadata : null,
        });
      }}
    />
  );
}

export default BranchLine;
