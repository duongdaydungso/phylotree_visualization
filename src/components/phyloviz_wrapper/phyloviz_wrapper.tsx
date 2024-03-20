import React, { useEffect, useRef } from "react";
import { PhyloVizCoreContentRef, PhyloVizCoreProps } from "../../models";
import { PhyloVizCore } from "../../core/instance.core";

export const Context = React.createContext<PhyloVizCore>(null as any);

export const PhyloVizWrapper = React.forwardRef(
  (
    props: Omit<PhyloVizCoreProps, "ref">,
    ref: React.Ref<PhyloVizCoreContentRef>
  ) => {
    const instance = useRef(new PhyloVizCore(props)).current;

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    return <Context.Provider value={instance}></Context.Provider>;
  }
);
