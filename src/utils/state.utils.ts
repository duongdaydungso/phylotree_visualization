import { initialSettings, initialState } from "../constants/state.constants";
import {
  PhyloVizCoreProps,
  PhyloVizCoreSettings,
  PhyloVizCoreState,
} from "../models";

export const createState = (props: PhyloVizCoreProps): PhyloVizCoreState => {
  return {
    tree: initialState.tree,
    newick: initialState.newick,
    collapsedList: initialState.collapsedList,
    x_scale: initialState.x_scale,
    y_scale: initialState.y_scale,
    color_scale: initialState.color_scale,
  };
};

export const createSettings = (
  props: PhyloVizCoreProps
): PhyloVizCoreSettings => {
  const newSettings = { ...initialSettings };

  Object.keys(props).forEach((key) => {
    const validValue = typeof props[key] !== "undefined";
    const validParameter = typeof initialSettings[key] !== "undefined";
    if (validParameter && validValue) {
      const dataType = Object.prototype.toString.call(initialSettings[key]);
      const isObject = dataType === "[object Object]";
      const isArray = dataType === "[object Array]";
      if (isObject) {
        newSettings[key] = {
          ...initialSettings[key],
          ...props[key],
        };
      } else if (isArray) {
        newSettings[key] = [...initialSettings[key], ...props[key]];
      } else {
        newSettings[key] = props[key];
      }
    }
  });

  return newSettings;
};
