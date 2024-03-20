import { initialSettings } from "../constants/state.constants";
import { PhyloVizCoreProps, PhyloVizCoreSettings } from "../models";

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
