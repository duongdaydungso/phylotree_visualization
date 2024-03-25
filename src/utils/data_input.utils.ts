import { PhyloVizSourceData, PhyloVizTreeData } from "../models";

import { phylotree } from "phylotree";

export const handleTreeInput = (
  sourceData: PhyloVizSourceData
): PhyloVizTreeData => {
  if (!sourceData.tree || !sourceData.tree.data) {
    return {
      tree: null,
      newick: "",
    };
  }

  if (sourceData.tree.dataType === "newick") {
    return handleTreeInputNewick(sourceData);
  }

  throw new Error("Invalid tree data type");
};

const handleTreeInputNewick = (
  sourceData: PhyloVizSourceData
): PhyloVizTreeData => {
  var tree = new phylotree(sourceData.tree.data);
  return {
    tree: tree,
    newick: sourceData.tree.data,
  };
};
