import React, { FunctionComponent } from "react";

import { line } from "d3-shape";

export interface IBranchProps {
  key: any;
  link: any;
  xScale: any;
  yScale: any;
  colorScale: any;
  isShowLabel: boolean;
  isShowBranchLength: boolean;
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
  supportValue: any;
  isCollapsed?: boolean;
  isLeaf: boolean;
}

const Branch: FunctionComponent<IBranchProps> = (props) => {
  // Destructure props
  const {
    link,
    xScale,
    yScale,
    colorScale,
    isShowLabel,
    isShowBranchLength,
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
    supportValue,
    isCollapsed = false,
    isLeaf,
  } = props;

  const { source, target } = link;

  const temp_name_array = target.data.name.split("/");

  const nodeName = isLeaf
    ? temp_name_array[0]
    : "Node " + temp_name_array[temp_name_array.length - 1];

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

  const collapsedPolygon: any = [
    [target_x + 18, target_y + 10],
    [target_x - 2, target_y],
    [target_x + 18, target_y - 10],
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
    target.data.name && labelStyler ? labelStyler(nodeName) : {};

  let firstEle = true;

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
            left: e.clientX + 20,
            top: e.clientY - 20,
            currentNode: target,
          });
        }}
      />
      {isCollapsed && <polygon points={collapsedPolygon} fill="grey" />}
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
          x={tracer_x2 + 20}
          y={target_y}
          textAnchor="start"
          alignmentBaseline="middle"
          {...Object.assign({}, labelStyle, label_style)}
          className="rp-label"
        >
          {nodeName.slice(0, maxLabelWidth)}
        </text>
      ) : null}
      {isShowBranchLength ? (
        <text
          x={source_x + (target_x - source_x) / 2 - 20}
          y={target_y - 8}
          textAnchor="start"
          alignmentBaseline="middle"
          className="rp-label"
        >
          {parseFloat(target.data.attribute).toFixed(4)}
        </text>
      ) : null}
      {supportValue ? (
        <text
          x={source_x + (target_x - source_x) / 2 - 13}
          y={target_y + 15}
          textAnchor="start"
          alignmentBaseline="middle"
          className="rp-label"
        >
          {supportValue.map((spVL: any) => {
            if (spVL.isShowing && temp_name_array[spVL.index] !== undefined) {
              const res = `${temp_name_array[spVL.index]}`;

              if (isLeaf) return null;

              if (firstEle) {
                firstEle = false;

                return res;
              } else return "/" + res;
            }

            return null;
          })}
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
