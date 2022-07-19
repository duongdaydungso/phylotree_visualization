import React from "react";

import PhylogeneticTree from "./PhylogeneticTree";

export interface IPhylotreeVisualizationProps {
  input: string;
}

export const PhylotreeVisualization: React.FunctionComponent<
  IPhylotreeVisualizationProps
> = (props) => {
  return (
    <div>
      <PhylogeneticTree newick_string={props.input} />
    </div>
  );
};
