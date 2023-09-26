import { useState, useEffect } from "react";
import { phylotree } from "phylotree";
import { max } from "d3-array";

import { isInList } from "../utils/utils";
import {
  DIRECTION_ASCENDING,
  DIRECTION_DEFAULT,
  SHOW_INTERNAL_NODE_DEFAULT,
} from "./phylogenticTreeConst";

function usePhylogeneticTree(newickInitialInput: string = "") {
  // Attribute **************************************************************
  const [newickString, setNewickString] = useState<string>(newickInitialInput);
  const [tree, setTree] = useState<any>(
    newickInitialInput == "" ? null : new phylotree(newickInitialInput)
  );
  const [collapsedList, setCollapsedList] = useState([]);

  // Method ****************************************************************
  // Create tree from newick string
  const createTreeByNewick = (input: string) => {
    setNewickString(input);
  };

  // Reroot tree using node as root
  const reRoot = (node: any) => {
    let pattern = /__reroot_top_clade/g;
    let r = tree.getNodeByName(node.data.name);
    let result = tree.reroot(r).getNewick().replace(pattern, "");
    setNewickString(result);
  };

  // View subtree using node as root
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
  };

  // Toggle highlight branch contain node
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
  };

  // Toggle collapse branch contain node
  const toggleCollapse = (node: any) => {
    let newCollapsedList: any;

    if (isInList(collapsedList, node)) {
      newCollapsedList = collapsedList.filter(
        (element: any) => element.data.name !== node.data.name
      );
    } else {
      newCollapsedList = collapsedList;

      newCollapsedList.push(node);
    }

    setCollapsedList(newCollapsedList);
  };

  // Place nodes in tree
  const placeNodes = (
    isShowInternalNode: boolean = SHOW_INTERNAL_NODE_DEFAULT,
    sort: string = DIRECTION_DEFAULT
  ) => {
    if (tree.nodes.data.name === "new_root") return;

    // Sort nodes in tree
    function sortNodes(direction: string) {
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

      const asc = direction == DIRECTION_ASCENDING;

      tree.resortChildren(function (a: any, b: any) {
        return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
      });
    }

    if (sort) {
      sortNodes(sort);
    }

    // Collapse nodes in collapsed list
    function collapsedNodeInList(node: any) {
      node.collapsed = isInList(collapsedList, node);

      if (node.data.name !== "root") {
        node.hidden = node.collapsed || node.parent.hidden;
      } else node.hidden = node.collapsed;

      if (!tree.isLeafNode(node)) {
        node.children.forEach((tmp: any) => {
          collapsedNodeInList(tmp);
        });
      }
    }

    if (collapsedList) {
      collapsedNodeInList(tree.getNodeByName("root"));
    }

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

  const attachTextWidth = (maxLabelWidth: number) => {
    function attachTextWidthFnc(node: any) {
      function text_width(text: any, size: any, max_width: any): number {
        const width = Math.min(max_width, text.length);
        return width * size * 0.60009765625;
      }

      node.data.text_width = text_width(node.data.name, 14, maxLabelWidth);

      if (node.children) node.children.forEach(attachTextWidthFnc);
    }

    attachTextWidthFnc(tree.nodes);
  };

  // Update ****************************************************************
  useEffect(() => {
    setTree(new phylotree(newickString));
  }, [newickString]);

  // Return ****************************************************************
  return {
    newickString,
    tree,
    createTreeByNewick,
    setNewickString,
    reRoot,
    viewSubtree,
    toggleHighlightBranch,
    toggleCollapse,
    placeNodes,
    attachTextWidth,
  };
}

export { usePhylogeneticTree };
