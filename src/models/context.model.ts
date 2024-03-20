import { PhyloVizCore } from "../core/instance.core";
import { DeepNonNullable } from "./helpers.model";

export type PhyloVizCoreContext = typeof PhyloVizCore.prototype;

export type PhyloVizCoreState = {};

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
};

export type PhyloVizCoreSettings = Pick<PhyloVizCoreProps, "testField"> &
  DeepNonNullable<Omit<PhyloVizCoreProps, "ref" | "children">>;
