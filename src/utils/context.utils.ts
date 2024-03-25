import {
  PhyloVizCoreContext,
  PhyloVizCoreContentRef,
  PhyloVizCoreContextState,
  PhyloVizCoreRef,
} from "../models/context.model";

export const getControls = (
  contextInstance: PhyloVizCoreContext
): PhyloVizCoreContentRef => {
  return {
    instance: contextInstance,
  };
};

export const getState = (
  contextInstance: PhyloVizCoreContext
): PhyloVizCoreContextState => {
  return {
    instance: contextInstance,
    state: contextInstance.state,
  };
};

export const getContext = (
  contextInstance: PhyloVizCoreContext
): PhyloVizCoreRef => {
  const ref = {} as PhyloVizCoreRef;

  Object.assign(ref, getState(contextInstance));
  Object.assign(ref, getControls(contextInstance));

  return ref;
};
