import React, { FunctionComponent } from "react";

import CollapsedPolygon from "./collapsedPolygon";
import BranchLine from "./branchLine";
import BranchLabel from "./branchLabel";
import BranchLength from "./branchLength";
import SupportValue from "./supportValue";

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

  const all_label_styles = Object.assign({}, labelStyle, label_style);

  if (target.hidden && !target.collapsed) return null;
  if (target.data.name !== "root") if (target.parent.hidden) return null;

  return (
    <g className="node">
      <BranchLine
        source_x={source_x}
        source_y={source_y}
        target_x={target_x}
        target_y={target_y}
        all_branch_styles={all_branch_styles}
        data={target}
        tooltip={tooltip}
        setTooltip={setTooltip}
        onBranchClick={onBranchClick}
      />
      {isCollapsed && <CollapsedPolygon x={target_x} y={target_y} />}
      {isShowLabel ? (
        <BranchLabel
          branch_x={target_x}
          text_x={tracer_x2}
          y={target_y}
          all_label_styles={all_label_styles}
          node_name={nodeName.slice(0, maxLabelWidth)}
        />
      ) : null}
      {isShowBranchLength ? (
        <BranchLength
          x={source_x + (target_x - source_x) / 2 - 20}
          y={target_y - 8}
          len={parseFloat(target.data.attribute).toFixed(4)}
        />
      ) : null}
      {supportValue && !isLeaf ? (
        <SupportValue
          x={source_x + (target_x - source_x) / 2 - 13}
          y={target_y + 15}
          supportValue={supportValue}
          tempNameArray={temp_name_array}
        />
      ) : null}
    </g>
  );
};

export default Branch;
