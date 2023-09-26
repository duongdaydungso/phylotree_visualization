import React from "react";
import { usePhylogeneticTree } from "./usePhylogeneticTree";
import PhylogeneticTreeComponent from "./PhylogenticTreeComponent";

export interface IPhylotreeVisualizationComponentProps {
  input: string;
}

const PhylotreeVisualizationComponent: React.FunctionComponent<
  IPhylotreeVisualizationComponentProps
> = (props) => {
  const { input } = props;

  const tree = usePhylogeneticTree(input);

  return (
    <div>
      <PhylogeneticTreeComponent tree={tree}></PhylogeneticTreeComponent>
    </div>
  );
};

export default PhylotreeVisualizationComponent;
