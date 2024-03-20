import {
  PhyloVizCoreProps,
  PhyloVizCoreRef,
  PhyloVizCoreSettings,
} from "../models";
import { createSettings } from "../utils/state.utils";

export class PhyloVizCore {
  public props: PhyloVizCoreProps;

  public settings: PhyloVizCoreSettings;
  public onChangeCallbacks: Set<(ctx: PhyloVizCoreRef) => void> = new Set();
  public onInitCallbacks: Set<(ctx: PhyloVizCoreRef) => void> = new Set();

  // Components
  public wrapperComponent: HTMLElement | null = null;
  public contentComponent: HTMLElement | null = null;

  // Constructor
  constructor(props: PhyloVizCoreProps) {
    this.props = props;
    this.settings = createSettings(this.props);
  }

  update = (newProps: PhyloVizCoreProps) => {
    this.props = newProps;
    this.settings = createSettings(this.props);
  };
}
