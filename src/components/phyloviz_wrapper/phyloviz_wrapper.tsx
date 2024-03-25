import React, { useEffect, useImperativeHandle, useRef } from "react";
import { PhyloVizCoreContentRef, PhyloVizCoreProps } from "../../models";
import { PhyloVizCore } from "../../core/instance.core";
import { getControls } from "../../utils/context.utils";

export const Context = React.createContext<PhyloVizCore>(null as any);

const getContent = (
  children: PhyloVizCoreProps["children"],
  ctx: PhyloVizCoreContentRef
) => {
  if (typeof children === "function") {
    return children(ctx);
  }

  return children;
};

export const PhyloVizWrapper = React.forwardRef(
  (
    props: Omit<PhyloVizCoreProps, "ref">,
    ref: React.Ref<PhyloVizCoreContentRef>
  ) => {
    const instance = useRef(new PhyloVizCore(props)).current;

    const content = getContent(props.children, getControls(instance));

    useImperativeHandle(ref, () => getControls(instance), [instance]);

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    return <Context.Provider value={instance}>{content}</Context.Provider>;
  }
);
