import React from "react";
import { PhylogeneticTree, usePhylogeneticTree } from "./usePhylogeneticTree";
import PhylogeneticTreeComponent from "./PhylogenticTreeComponent";
import { PhylogenticTreeSettings } from "./phylogenticTreeSettings";

export interface IPhylotreeVisualizationComponentProps {
  input: string;
}

const PhylotreeVisualizationComponent: React.FunctionComponent<
  IPhylotreeVisualizationComponentProps
> = (props) => {
  const { input } = props;

  const tree: PhylogeneticTree = usePhylogeneticTree(input);
  const treeSettings: PhylogenticTreeSettings = {
    isAllowHighlightBranch: true,
  };

  return (
    <div>
      <PhylogeneticTreeComponent
        tree={tree}
        treeSettings={treeSettings}
      ></PhylogeneticTreeComponent>
    </div>
  );
};

export default PhylotreeVisualizationComponent;
