import {
  PhyloVizCoreContext,
  PhyloVizSourceData,
  PhyloVizTreeData,
} from "../models";
import { handleTreeInput } from "./data_input.utils";

export const createTreeStateFromInput = (
  contextInstance: PhyloVizCoreContext,
  sourceData?: PhyloVizSourceData
): PhyloVizTreeData => {
  if (sourceData === undefined) {
    return {
      newick: "",
      tree: {},
    };
  }

  const treeState = handleTreeInput(sourceData);

  // Save tree state
  contextInstance.state.tree = treeState.tree;
  contextInstance.state.newick = treeState.newick;
  return treeState;
};

export const isInCollapsedList = (haystack: any, needle: any): boolean => {
  for (const item of haystack) {
    if (item.data.name === needle.data.name) {
      return true;
    }
  }

  return false;
};
