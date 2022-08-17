import React, { FunctionComponent } from "react";

import { line } from "d3-shape";

export interface IBranchProps {
  key: any;
  link: any;
  xScale: any;
  yScale: any;
  colorScale: any;
  isShowLabel: boolean;
  width: number;
  maxLabelWidth: number;
  alignTips: string;
  branchStyler: any;
  labelStyler: any;
  branchStyle?: any;
  labelStyle?: any;
  tooltip?: any;
  setTooltip?: any;
  onBranchClick?: any;
}

const Branch: FunctionComponent<IBranchProps> = (props) => {
  // Destructure props
  const {
    link,
    xScale,
    yScale,
    colorScale,
    isShowLabel,
    width,
    maxLabelWidth,
    alignTips,
    branchStyler,
    labelStyler,
    branchStyle = {
      strokeWidth: 2,
      stroke: "grey",
    },
    labelStyle = {},
    tooltip,
    setTooltip,
    onBranchClick,
  } = props;

  const { source, target } = link;

  const source_x = xScale(source.data.abstract_x);
  const source_y = yScale(source.data.abstract_y);
  const target_x = xScale(target.data.abstract_x);
  const target_y = yScale(target.data.abstract_y);

  const tracer_x2 =
    alignTips == "right" ? width - (target.data.text_width || 0) : target_x;

  const data: [number, number][] = [
    [source_x, source_y],
    [source_x, target_y],
    [target_x, target_y],
  ];

  const branch_line = line()
    .x((d: [number, number]) => d[0])
    .y((d: [number, number]) => d[1]);

  const computed_branch_styles = branchStyler
    ? branchStyler(target.data)
    : target.data.annotation && colorScale
    ? {
        stroke: colorScale(target.data.annotation),
      }
    : {};

  const all_branch_styles = Object.assign(
    {},
    branchStyle,
    computed_branch_styles
  );

  const label_style =
    target.data.name && labelStyler ? labelStyler(target.data) : {};

  if (target.hidden && !target.collapsed) return null;
  if (target.data.name !== "root") if (target.parent.hidden) return null;

  return (
    <g className="node">
      <path
        className="rp-branch"
        fill="none"
        d={branch_line(data)}
        {...all_branch_styles}
        onMouseMove={
          tooltip
            ? (e) => {
                setTooltip({
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                  data: target.data,
                });
              }
            : undefined
        }
        onMouseOut={
          tooltip
            ? (e) => {
                setTooltip(false);
              }
            : undefined
        }
        onClick={(e) => {
          onBranchClick({
            left: e.screenX + 20,
            top: e.screenY - 120,
            currentNode: target,
          });
        }}
      />
      {isShowLabel ? (
        <line
          x1={target_x}
          x2={tracer_x2}
          y1={target_y}
          y2={target_y}
          className="rp-branch-tracer"
        />
      ) : null}
      {isShowLabel ? (
        <text
          x={tracer_x2 + 5}
          y={target_y}
          textAnchor="start"
          alignmentBaseline="middle"
          {...Object.assign({}, labelStyle, label_style)}
          className="rp-label"
        >
          {target.data.name.slice(0, maxLabelWidth)}
        </text>
      ) : null}
    </g>
  );
};

Branch.defaultProps = {
  branchStyle: {
    strokeWidth: 2,
    stroke: "grey",
  },
  labelStyle: {},
};

export default Branch;
