import React, { useState, useEffect, useRef } from "react";

import { phylotree } from "phylotree";

import { max } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { AxisTop } from "d3-react-axis";

import Branch from "../branch/branch";

import "./styles/PhylogeneticTree.css";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SVG from "./svg";

import DropdownsMenu, { IDropdownsMenuProps } from "./DropdownsMenu";

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

function isInCollapsedList(haystack: any, needle: any) {
  for (const item of haystack) {
    if (item.data.name === needle.data.name) {
      return true;
    }
  }

  return false;
}

function collapsedNodeInList(tree: any, collapsedList: any, node: any) {
  node.collapsed = isInCollapsedList(collapsedList, node);

  if (node.data.name !== "root") {
    node.hidden = node.collapsed || node.parent.hidden;
  } else node.hidden = node.collapsed;

  if (!tree.isLeafNode(node)) {
    node.children.forEach((tmp: any) => {
      collapsedNodeInList(tree, collapsedList, tmp);
    });
  }
}

function placenodes(
  tree: any,
  isShowInternalNode: boolean | undefined,
  sort: any,
  collapsedList: any
): void {
  if (tree.nodes.data.name === "new_root") return;

  if (sort) {
    sort_nodes(tree, sort);
  }

  if (collapsedList) {
    collapsedNodeInList(tree, collapsedList, tree.getNodeByName("root"));
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

    if (node.data.name !== "root") node.data.abstract_y = undefined;

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

    let root = tree.getNodeByName("root");

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
  newickString: string;
  setNewickString: any;
  width?: number;
  height?: number;
  padding?: number;
  isShowInternalNode?: boolean;
  sort?: string | null;
  maxLabelWidth?: number;
  highlightBranches?: boolean | any;
  isShowLabel?: boolean;
  isShowBranchLength?: boolean;
  alignTips?: string;
  branchStyler?: any;
  labelStyler?: any;
  tooltip?: any;
  supportValue: any;
  isShowScale?: boolean;
}

const PhylogeneticTree: React.FunctionComponent<IPhylogeneticTreeProps> = (
  props
) => {
  // Destructure props
  let {
    newickString,
    setNewickString,
    width = 500,
    height = 500,
    padding = 20,
    isShowInternalNode = false,
    sort = null,
    maxLabelWidth = 20,
    highlightBranches = false,
    isShowLabel = true,
    isShowBranchLength = false,
    alignTips = "left",
    branchStyler = null,
    labelStyler = null,
    supportValue,
    isShowScale = false,
  } = props;

  const [tree, setTree] = useState<any>(new phylotree(newickString));
  const [tooltip, setTooltip] = useState(false);
  const [collapsedList, setCollapsedList] = useState([]);
  const [dropdownsMenuState, setDropdownsMenuState] =
    useState<IDropdownsMenuProps | null>(null);
  const dropdownsMenuContainer = useRef<HTMLDivElement>(null);

  // Function
  const reRoot = (node: any) => {
    let pattern = /__reroot_top_clade/g;
    let r = tree.getNodeByName(node.data.name);
    let result = tree.reroot(r).getNewick().replace(pattern, "");
    setNewickString(result);
    setDropdownsMenuState(null);
  };

  const viewSubtree = (node: any) => {
    let posS = newickString.search(node.data.name);
    let posE = newickString.search(node.data.name);

    if (posS > 0)
      if (newickString[posS - 1] === ")") {
        let cnt = 1;
        posS--;

        while (posS > 0 && cnt > 0) {
          posS--;

          if (newickString[posS] === "(") cnt--;
          else if (newickString[posS] === ")") cnt++;
        }
      }

    while (
      newickString[posE] !== "," &&
      newickString[posE] !== ")" &&
      newickString[posE] !== "("
    )
      posE++;

    let result = newickString.substring(posS, posE);

    setNewickString(result);
    setDropdownsMenuState(null);
  };

  const toggleHighlightBranch = (node: any) => {
    let pos = newickString.search(node.data.name);

    pos += node.data.name.length;

    let result = newickString;

    if (newickString.substring(pos, pos + 11) === "{highlight}") {
      result =
        newickString.substring(0, pos) + newickString.substring(pos + 11);
    } else if (newickString[pos] !== "{") {
      result =
        newickString.substring(0, pos) +
        "{highlight}" +
        newickString.substring(pos);
    }

    setNewickString(result);
    setDropdownsMenuState(null);
  };

  const toggleCollapse = (node: any) => {
    let newCollapsedList: any;

    if (isInCollapsedList(collapsedList, node)) {
      newCollapsedList = collapsedList.filter(
        (element: any) => element.data.name !== node.data.name
      );
    } else {
      newCollapsedList = collapsedList;

      newCollapsedList.push(node);
    }

    setCollapsedList(newCollapsedList);

    setDropdownsMenuState(null);
  };

  const handleClickOutsidedropdownsMenu = (event: any) => {
    if (
      dropdownsMenuContainer.current &&
      !dropdownsMenuContainer.current.contains(event.target)
    ) {
      setDropdownsMenuState(null);
    }
  };

  // Update
  useEffect(() => {
    setDropdownsMenuState(null);

    window.addEventListener("mousedown", handleClickOutsidedropdownsMenu);

    return () => {
      window.removeEventListener("mousedown", handleClickOutsidedropdownsMenu);
    };
  }, []);

  useEffect(() => {
    setTree(new phylotree(newickString));
  }, [newickString]);

  // Operation

  if (!tree && !newickString) return <div />;

  placenodes(tree, isShowInternalNode, sort, collapsedList);

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

  if (!tree.max_x || !tree.max_y) return <div />;

  const x_scale = scaleLinear().domain([0, tree.max_x]).range([0, rightmost]);

  const y_scale = scaleLinear().domain([0, tree.max_y]).range([0, height]);

  const color_scale = getColorScale(tree, highlightBranches);

  return (
    <div>
      <TransformWrapper minScale={1} maxScale={200}>
        <TransformComponent>
          <SVG
            id="svg-phylotree"
            width={width + 2 * padding}
            height={height + 2 * padding + (isShowScale ? 60 : 0)}
          >
            <g transform={`translate(${padding}, ${padding})`}>
              {isShowScale ? (
                <g>
                  <AxisTop transform={`translate(0, 20)`} scale={x_scale} />
                </g>
              ) : null}
              <g transform={`translate(0, ${isShowScale ? 60 : 0})`}>
                {tree.links.map((link: any) => {
                  const source_id = link.source.unique_id;
                  const target_id = link.target.unique_id;
                  const key = source_id + "," + target_id;
                  const show_label =
                    isShowInternalNode ||
                    (isShowLabel && tree.isLeafNode(link.target));
                  return (
                    <Branch
                      key={key}
                      xScale={x_scale}
                      yScale={y_scale}
                      colorScale={color_scale}
                      link={link}
                      isShowLabel={show_label}
                      isShowBranchLength={isShowBranchLength}
                      maxLabelWidth={maxLabelWidth}
                      width={width}
                      alignTips={alignTips}
                      branchStyler={branchStyler}
                      labelStyler={labelStyler}
                      tooltip={props.tooltip}
                      setTooltip={setTooltip}
                      onBranchClick={setDropdownsMenuState}
                      supportValue={supportValue}
                      isCollapsed={isInCollapsedList(
                        collapsedList,
                        link.target
                      )}
                      isLeaf={tree.isLeafNode(link.target)}
                    />
                  );
                })}
                {tooltip ? (
                  <props.tooltip width={width} height={height} {...tooltip} />
                ) : null}
              </g>
            </g>
          </SVG>
        </TransformComponent>
      </TransformWrapper>
      <div ref={dropdownsMenuContainer}>
        {dropdownsMenuState ? (
          <DropdownsMenu
            left={dropdownsMenuState.left}
            top={dropdownsMenuState.top}
            currentNode={dropdownsMenuState.currentNode}
            reRootFunction={reRoot}
            toggleCollapse={toggleCollapse}
            viewSubtree={viewSubtree}
            toggleHighlightBranch={toggleHighlightBranch}
            isLeaf={tree.isLeafNode(dropdownsMenuState.currentNode)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PhylogeneticTree;
