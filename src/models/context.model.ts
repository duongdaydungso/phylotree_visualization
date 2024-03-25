import { PhyloVizCore } from "../core/instance.core";
import { DeepNonNullable } from "./helpers.model";

import { ScaleLinear, ScaleOrdinal } from "d3-scale";

export type PhyloVizCoreContext = typeof PhyloVizCore.prototype;

export type PhyloVizCoreState = {
  newick: string;
  tree: any;
  collapsedList: string[];
  x_scale: ScaleLinear<number, number, never> | null;
  y_scale: ScaleLinear<number, number, never> | null;
  color_scale: ScaleOrdinal<string, unknown, never> | null;
};

export type PhyloVizCoreContextState = {
  instance: PhyloVizCoreContext;
  state: PhyloVizCoreState;
};

export type PhyloVizCoreHandlers = {};

export type PhyloVizCoreContentRef = {
  instance: PhyloVizCoreContext;
} & PhyloVizCoreHandlers;

export type PhyloVizCoreRef = PhyloVizCoreContextState & PhyloVizCoreHandlers;

export type PhyloVizCoreRefProps = {
  setRef: (context: PhyloVizCoreRef) => void;
} & Omit<PhyloVizCoreProps, "ref">;

export type PhyloVizCoreProps = {
  children?: React.ReactNode;
  ref?: React.Ref<PhyloVizCoreRef>;
  testField?: string;
  testFieldB?: number;

  viewWidth?: number;
  viewHeight?: number;
  viewPadding?: number;
  maxLabelWidth?: number;

  sort?: string;
  alignTips?: string;
  isShowInternalNode?: boolean;
  isShowScale?: boolean;
  isShowLabel?: boolean;
  isShowBranchLength?: boolean;
  highlightBranches?: boolean;
};

export type PhyloVizCoreSettings = Pick<PhyloVizCoreProps, "testField"> &
  DeepNonNullable<Omit<PhyloVizCoreProps, "ref" | "children">>;
