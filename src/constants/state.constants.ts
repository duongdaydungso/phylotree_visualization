import { PhyloVizCoreSettings, PhyloVizCoreState } from "../models";

export const initialState: PhyloVizCoreState = {
  tree: null,
  newick: "",
  collapsedList: [],
  x_scale: null,
  y_scale: null,
  color_scale: null,
};

export const initialSettings: PhyloVizCoreSettings = {
  testField: "test",
  testFieldB: 0,

  viewWidth: 500,
  viewHeight: 500,
  viewPadding: 20,
  maxLabelWidth: 20,

  sort: "ascending", // ascending | descending
  alignTips: "left", // left | right
  isShowInternalNode: false,
  isShowScale: false,
  isShowLabel: true,
  isShowBranchLength: false,
  highlightBranches: true,
};
