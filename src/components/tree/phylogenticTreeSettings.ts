import { TREE_CONST } from "./phylogenticTreeConst";

export interface PhylogenticTreeSettings {
  isShowInternalNode?: boolean;
  sortOrder?: string;
  maxLabelWidth?: number;
  isAllowHighlightBranch?: boolean;
}

export const defaultPhylogenticTreeSettings: PhylogenticTreeSettings = {
  isShowInternalNode: TREE_CONST.SHOW_INTERNAL_NODE_DEFAULT,
  sortOrder: TREE_CONST.SORT_ORDER_DEFAULT,
  maxLabelWidth: TREE_CONST.LABEL_WIDTH_MAX_DEFAULT,
  isAllowHighlightBranch: TREE_CONST.HIGHLIGHT_BRANCH_ALLOW_DEFAULT,
};
