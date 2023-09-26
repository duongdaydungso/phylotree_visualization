import React from "react";

export interface IPhylogeneticTreeComponentProps {
  tree: any;
}

const PhylogeneticTreeComponent: React.FunctionComponent<
  IPhylogeneticTreeComponentProps
> = (props) => {
  const { tree } = props;
  // TO DO: render the tree

  return <div>{tree.newickString}</div>;
};

export default PhylogeneticTreeComponent;
