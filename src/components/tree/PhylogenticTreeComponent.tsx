import React from "react";

import { scaleLinear } from "d3-scale";

import {
  PhylogenticTreeSettings,
  defaultPhylogenticTreeSettings,
} from "./phylogenticTreeSettings";
import { PhylogeneticTree } from "./usePhylogeneticTree";
import { TREE_COMPONENT_CONST } from "./phylogeneticTreeComponentConst";

export interface IPhylogeneticTreeComponentProps {
  tree: PhylogeneticTree;
  treeSettings?: PhylogenticTreeSettings;
  width?: number;
  height?: number;
}

const PhylogeneticTreeComponent: React.FunctionComponent<
  IPhylogeneticTreeComponentProps
> = (props) => {
  const {
    tree,
    width = TREE_COMPONENT_CONST.WIDTH_DEFAULT,
    height = TREE_COMPONENT_CONST.HEIGHT_DEFAULT,
  } = props;

  const settings: PhylogenticTreeSettings = {
    ...defaultPhylogenticTreeSettings,
    ...props.treeSettings,
  };

  // Operation

  if (!tree) return <div />;

  tree.placeNodes(settings.isShowInternalNode, settings.sortOrder);
  tree.attachTextWidth(settings.maxLabelWidth);

  const sorted_tips = tree.tree
    .getTips()
    .sort((a: any, b: any) => b.data.abstract_x - a.data.abstract_x);

  let rightmost = width;

  for (let i = 0; i < sorted_tips.length; i++) {
    let tip = sorted_tips[i];

    rightmost = width - tip.data.text_width;

    let scale = rightmost / tip.data.abstract_x;

    let none_cross = sorted_tips
      .map((tip: any) => {
        const tip_x = tip.data.abstract_x * scale,
          text_x = width - tip.data.text_width,
          this_doesnt_cross = Math.floor(tip_x) < Math.ceil(text_x);

        return this_doesnt_cross;
      })
      .every((x: any) => x);

    if (none_cross) break;
  }

  if (!tree.tree.max_x || !tree.tree.max_y) return <div />;

  const x_scale = scaleLinear()
    .domain([0, tree.tree.max_x])
    .range([0, rightmost]);

  const y_scale = scaleLinear().domain([0, tree.tree.max_y]).range([0, height]);

  const color_scale = settings.isAllowHighlightBranch
    ? tree.getColorScale()
    : null;

  return <div>{tree.newickString}</div>;
};

export default PhylogeneticTreeComponent;
