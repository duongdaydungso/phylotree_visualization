import { max } from "d3-array";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const accessor = (node: any): number => {
  return +node.data.attribute;
};

const x_branch_lengths = (node: any): number => {
  if (!node.parent) return 0;

  const tmp = accessor(node);

  return tmp + node.parent.data.abstract_x;
};

const x_no_branch_lengths = (node: any): number => {
  return node.parent ? node.parent.data.abstract_x + 1 : 0;
};

const text_width = (text: any, size: any, max_width: any): number => {
  const width = Math.min(max_width, text.length);
  return width * size * 0.60009765625;
};

const sort_nodes = (tree: any, direction: any): void => {
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
};

export const isInCollapsedList = (haystack: any, needle: any) => {
  for (const item of haystack) {
    if (item.data.name === needle.data.name) {
      return true;
    }
  }

  return false;
};

export const collapsedNodeInList = (
  tree: any,
  collapsedList: any,
  node: any
) => {
  node.collapsed = isInCollapsedList(collapsedList, node);

  if (node.data.name !== "root") {
    node.hidden = node.collapsed || node.parent.hidden;
  } else node.hidden = node.collapsed;

  if (!tree.isLeafNode(node)) {
    node.children.forEach((tmp: any) => {
      collapsedNodeInList(tree, collapsedList, tmp);
    });
  }
};

export const placenodes = (
  tree: any,
  isShowInternalNode: boolean | undefined,
  sort: string | undefined,
  collapsedList: any
): void => {
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
};

export const getColorScale = (
  tree: any,
  highlightBranches: boolean | undefined
) => {
  if (!highlightBranches) return null;

  return tree.parsed_tags && highlightBranches
    ? scaleOrdinal().domain(tree.parsed_tags).range(schemeCategory10)
    : null;
};

export const attachTextWidth = (node: any, maxLabelWidth: number): void => {
  node.data.text_width = text_width(node.data.name, 14, maxLabelWidth);

  if (node.children) node.children.forEach(attachTextWidth);
};
