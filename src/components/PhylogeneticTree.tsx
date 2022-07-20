import React, { useState } from "react";

import { phylotree } from "phylotree";

import { max } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

import Branch from "./branch";

import "./phylotree.css";

function accessor(node: any): number {
  return +node.data.attribute;
}

function x_branch_lengths(node: any): number {
  if (!node.parent) return 0;

  const tmp = accessor(node);

  return tmp + node.parent.data.abstract_x;
}

function x_no_branch_lengths(node: any): number {
  return node.parent ? node.parent.data.abstract_x + 1 : 0;
}

function text_width(text: any, size: any, max_width: any): number {
  const width = Math.min(max_width, text.length);
  return width * size * 0.60009765625;
}

function sort_nodes(tree: any, direction: any): void {
  tree.traverse_and_compute(function (n: any) {
    let d = 1;

    if (n.children && n.children.length) {
      d += Number(
        max(n.children, function (d: any) {
          return d["count_depth"];
        })
      );
    }

    n["count_depth"] = d;
  });

  const asc = direction == "ascending";

  tree.resortChildren(function (a: any, b: any) {
    return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
  });
}

function placenodes(
  tree: any,
  isShowInternalNode: boolean | undefined,
  sort: any
): void {
  if (sort) {
    sort_nodes(tree, sort);
  }

  let current_leaf_height = -1;
  let unique_id = 0;

  tree.max_x = 0;

  const has_branch_lengths = Boolean(accessor(tree.getTips()[0]));
  const x_branch_length = has_branch_lengths
    ? x_branch_lengths
    : x_no_branch_lengths;

  function node_layout(node: any): any {
    if (!node.unique_id) {
      unique_id = node.unique_id = unique_id + 1;
    }

    node.data.abstract_x = x_branch_length(node);

    tree.max_x = Math.max(tree.max_x, node.data.abstract_x);

    if (node.children) {
      node.data.abstract_y =
        node.children.map(node_layout).reduce((a: any, b: any) => a + b, 0) /
        node.children.length;
    } else {
      current_leaf_height = node.data.abstract_y = current_leaf_height + 1;
    }

    return node.data.abstract_y;
  }

  function internal_node_layout(node: any): void {
    unique_id = node.unique_id = unique_id + 1;

    node.data.abstract_x = x_branch_length(node);

    tree.max_x = Math.max(tree.max_x, node.data.abstract_x);

    if (!tree.isLeafNode(node)) {
      node.children.forEach(internal_node_layout);
    }

    if (!node.data.abstract_y && node.data.name != "root") {
      current_leaf_height = node.data.abstract_y = current_leaf_height + 1;

      tree.node_order.push(node.data.name);
    }

    if (
      node.parent &&
      !node.parent.data.abstract_y &&
      node.data.name != "root"
    ) {
      if (node.parent.data.name != "root") {
        current_leaf_height = node.parent.data.abstract_y =
          current_leaf_height + 1;

        tree.node_order.push(node.parent.data.name);
      }
    }

    tree.max_y = Math.max(tree.max_y, current_leaf_height);
  }

  if (isShowInternalNode) {
    tree.max_y = 0;
    tree.node_order = [];
    internal_node_layout(tree.nodes);

    const root = tree.getNodeByName("root");

    root.data.abstract_y =
      root.children
        .map((child: any) => child.data.abstract_y)
        .reduce((a: any, b: any) => a + b, 0) / root.children.length;
  } else {
    node_layout(tree.nodes);

    tree.max_y = current_leaf_height;
  }
}

function getColorScale(tree: any, highlightBranches: boolean | undefined) {
  if (!highlightBranches) return null;

  return tree.parsed_tags && highlightBranches
    ? scaleOrdinal().domain(tree.parsed_tags).range(schemeCategory10)
    : null;
}

export interface IPhylogeneticTreeProps {
  newick_string: string;
  width?: number;
  height?: number;
  padding?: number;
  isShowInternalNode?: boolean;
  sort?: string | null;
  maxLabelWidth?: number;
  highlightBranches?: boolean | any;
  isShowLabels?: boolean;
  alignTips?: string;
  branchStyler?: any;
  labelStyler?: any;
  onBranchClick?: any;
  tooltip?: any;
}

const PhylogeneticTree: React.FunctionComponent<IPhylogeneticTreeProps> = (
  props
) => {
  // Destructure props
  let {
    newick_string,
    width = 500,
    height = 500,
    padding = 20,
    isShowInternalNode = false,
    sort = null,
    maxLabelWidth = 20,
    highlightBranches = false,
    isShowLabels = true,
    alignTips = "left",
    branchStyler = null,
    labelStyler = null,
    onBranchClick = () => {},
  } = props;

  const [tooltip, setTooltip] = useState(false);

  // Create tree
  let tree: any;

  if (!tree && !newick_string) {
    return <g />;
  } else if (!tree) {
    tree = new phylotree(newick_string);
  }

  placenodes(tree, isShowInternalNode, sort);

  function attachTextWidth(node: any): void {
    node.data.text_width = text_width(node.data.name, 14, maxLabelWidth);

    if (node.children) node.children.forEach(attachTextWidth);
  }

  attachTextWidth(tree.nodes);

  const sorted_tips = tree
    .getTips()
    .sort((a: any, b: any) => b.data.abstract_x - a.data.abstract_x);

  let rightmost = width;

  for (let i = 0; i < sorted_tips.length; i++) {
    let tip = sorted_tips[i];

    rightmost = width - tip.data.text_width;

    let scale = rightmost / tip.data.abstract_x;

    let none_cross = sorted_tips
      .map((tip: any) => {
        const tip_x = tip.data.abstract_x * scale,
          text_x = width - tip.data.text_width,
          this_doesnt_cross = Math.floor(tip_x) < Math.ceil(text_x);

        return this_doesnt_cross;
      })
      .every((x: any) => x);

    if (none_cross) break;
  }

  const x_scale = scaleLinear().domain([0, tree.max_x]).range([0, rightmost]);

  const y_scale = scaleLinear().domain([0, tree.max_y]).range([0, height]);

  const color_scale = getColorScale(tree, highlightBranches);

  return (
    <g transform={`translate(${padding}, ${padding})`}>
      {tree.links.map((link: any) => {
        const source_id = link.source.unique_id;
        const target_id = link.target.unique_id;
        const key = source_id + "," + target_id;
        const show_label =
          isShowInternalNode || (isShowLabels && tree.isLeafNode(link.target));
        return (
          <Branch
            key={key}
            xScale={x_scale}
            yScale={y_scale}
            colorScale={color_scale}
            link={link}
            isShowLabel={show_label}
            maxLabelWidth={maxLabelWidth}
            width={width}
            alignTips={alignTips}
            branchStyler={branchStyler}
            labelStyler={labelStyler}
            tooltip={props.tooltip}
            setTooltip={setTooltip}
            onBranchClick={onBranchClick}
          />
        );
      })}
      {tooltip ? (
        <props.tooltip width={width} height={height} {...tooltip} />
      ) : null}
    </g>
  );
};

export default PhylogeneticTree;
