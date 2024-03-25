export { PhylotreeVisualization } from "./components";
export { exportImage } from "./components/utilityFunctions";

import React from "react";
import ReactDOM from "react-dom";

import { AppWrapper } from "./App";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById("root")
);
