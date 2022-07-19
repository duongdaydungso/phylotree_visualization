import React from "react";

import { PhylotreeVisualization } from "./components";

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  // const newick =
  //     "(LngfishAu:0.1712920518,(LngfishSA:0.1886950015,LngfishAf:0.1650939272):0.1074934723,(Frog:0.2567782559,((((Turtle:0.2218655584,(Crocodile:0.3063185169,Bird:0.2314909181):0.0651737381):0.0365470299,Sphenodon:0.3453327943):0.0204990607,Lizard:0.3867277545):0.0740995375,(((Human:0.1853482056,(Seal:0.0945218205,(Cow:0.0823893414,Whale:0.1013456886):0.0404741864):0.0252648881):0.0341157851,(Mouse:0.0584468890,Rat:0.0906222037):0.1219452651):0.0608099176,(Platypus:0.1922418336,Opossum:0.1511451490):0.0373121980):0.1493323365):0.1276903176):0.0942232386);";
  const newick: string = "(A:1,(B:1,C:1):1,(D:1,(E:1,F:1):1):1);";

  return (
    <div>
      <PhylotreeVisualization input={newick} />
    </div>
  );
};

export default App;
