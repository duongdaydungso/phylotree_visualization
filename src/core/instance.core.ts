import { scaleLinear } from "d3-scale";
import {
  PhyloVizCoreProps,
  PhyloVizCoreRef,
  PhyloVizCoreSettings,
  PhyloVizCoreState,
  PhyloVizSourceData,
} from "../models";
import { createTreeStateFromInput } from "../utils";
import { createSettings, createState } from "../utils/state.utils";
import { attachTextWidth, getColorScale, placenodes } from "./tree.core";

export class PhyloVizCore {
  public props: PhyloVizCoreProps;

  public state: PhyloVizCoreState;

  public settings: PhyloVizCoreSettings;
  public onChangeCallbacks: Set<(ctx: PhyloVizCoreRef) => void> = new Set();
  public onInitCallbacks: Set<(ctx: PhyloVizCoreRef) => void> = new Set();

  // Constructor
  constructor(props: PhyloVizCoreProps) {
    this.props = props;
    this.settings = createSettings(this.props);
    this.state = createState(this.props);
  }

  update = (newProps: PhyloVizCoreProps) => {
    this.props = newProps;
    this.settings = createSettings(this.props);
    this.calculateTree();
  };

  // Init
  init = (sourceData: PhyloVizSourceData) => {
    createTreeStateFromInput(this, sourceData);
    this.calculateTree();
  };

  // Calculate tree
  calculateTree = () => {
    placenodes(
      this.state.tree,
      this.settings.isShowInternalNode,
      this.settings.sort,
      this.state.collapsedList
    );

    attachTextWidth(this.state.tree.nodes, this.settings.maxLabelWidth);

    const sorted_tips = this.state.tree
      .getTips()
      .sort((a: any, b: any) => b.data.abstract_x - a.data.abstract_x);

    let rightmost = this.settings.viewWidth;

    for (let i = 0; i < sorted_tips.length; i++) {
      let tip = sorted_tips[i];

      rightmost = this.settings.viewWidth - tip.data.text_width;

      let scale = rightmost / tip.data.abstract_x;

      let none_cross = sorted_tips
        .map((tip: any) => {
          const tip_x = tip.data.abstract_x * scale,
            text_x = this.settings.viewWidth - tip.data.text_width,
            this_doesnt_cross = Math.floor(tip_x) < Math.ceil(text_x);

          return this_doesnt_cross;
        })
        .every((x: any) => x);

      if (none_cross) break;
    }

    if (!this.state.tree.max_x || !this.state.tree.max_y) {
      this.state.x_scale = null;
      this.state.y_scale = null;
    } else {
      this.state.x_scale = scaleLinear()
        .domain([0, this.state.tree.max_x])
        .range([0, rightmost]);
      this.state.y_scale = scaleLinear()
        .domain([0, this.state.tree.max_y])
        .range([0, this.settings.viewHeight]);
    }

    this.state.color_scale = getColorScale(
      this.state.tree,
      this.settings.highlightBranches
    );
  };
}
