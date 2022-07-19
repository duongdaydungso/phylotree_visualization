import React from "react";

export interface IPhylogeneticTreeProps {
  newick_string: string;
}

const PhylogeneticTree: React.FunctionComponent<IPhylogeneticTreeProps> = (
  props
) => {
  return <div>{props.newick_string}</div>;
};

export default PhylogeneticTree;
