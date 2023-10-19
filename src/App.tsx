import React, { useEffect, useState } from "react";

import { PhylotreeVisualization, exportImage } from "./components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faSortAmountUp,
  faAlignRight,
  faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

export interface IAppProps {}

function showToolTip(tooltipData: any) {
  const { x, y, node, metadata } = tooltipData;

  if (!node && !metadata) return null;

  return (
    <div
      className="tooltip-container"
      style={{
        left: x + 20,
        top: y - 20,
      }}
    >
      {node && <div className="tooltip-title">{node.data.name}</div>}
      {metadata && (
        <div className="tooltip-content">
          <div>Color: {metadata.color}</div>
          <div>Shape: {metadata.shape}</div>
          <div>Size: {metadata.size}</div>
          <div>Label: {metadata.label}</div>
        </div>
      )}
    </div>
  );
}

const App: React.FunctionComponent<IAppProps> = (props) => {
  //   const newick =
  //     "(LngfishAu:0.1712920518,(LngfishSA:0.1886950015,LngfishAf:0.1650939272):0.1074934723,(Frog:0.2567782559,((((Turtle:0.2218655584,(Crocodile:0.3063185169,Bird:0.2314909181):0.0651737381):0.0365470299,Sphenodon:0.3453327943):0.0204990607,Lizard:0.3867277545):0.0740995375,(((Human:0.1853482056,(Seal:0.0945218205,(Cow:0.0823893414,Whale:0.1013456886):0.0404741864):0.0252648881):0.0341157851,(Mouse:0.0584468890,Rat:0.0906222037):0.1219452651):0.0608099176,(Platypus:0.1922418336,Opossum:0.1511451490):0.0373121980):0.1493323365):0.1276903176):0.0942232386);";
  const newick =
    "(LngfishAu:0.1719701100,(LngfishSA:0.1886808867,LngfishAf:0.1644491074)100/100/1/100:0.1087920616,(Frog:0.2578038925,((((Turtle:0.2233271857,(Crocodile:0.3082539507,Bird:0.2315153950)97.5/96.7/1/97:0.0653098323)83.1/76.8/0.993/67:0.0358359250,Sphenodon:0.3469967273)41.2/53.5/0.552/50:0.0198995128,Lizard:0.3865087507)98.8/98.8/1/99:0.0751759947,(((Human:0.1855732387,(Seal:0.0948685218,(Cow:0.0818779989,Whale:0.1016071305)99.6/99.2/1/99:0.0405693917)71.1/70.3/0.983/68:0.0246111268)91.7/89/1/87:0.0334775846,(Mouse:0.0587317507,Rat:0.0906720496)100/100/1/100:0.1233749965)99.4/99.5/1/99:0.0604351787,(Platypus:0.1912926848,Opossum:0.1516743301)95/95.9/1/99:0.0379715595)100/100/1/100:0.1491564171)100/100/1/100:0.1294184984)99.8/100/1/100:0.0950509487);";

  //   const newick = "(A:1,(B:1,C:1):1,(D:1,(E:1,F:1):1):1);";

  const metadata: Array<Object> = [];

  // Extract species names from newick
  const species = newick
    .match(/\w+(?=:)/g)
    // .match(/s\d+/g)
    ?.filter((name, index, self) => self.indexOf(name) === index);

  // Create metadata for each species
  if (species) {
    species.forEach((name) => {
      metadata.push({
        name,
        color: name.length % 2 == 0 ? "green" : "yellow",
        shape: "square",
        size: 8,
        label: name,
        supportValue: {
          spvlA: 0.3,
          spvlB: 0.4,
          spvlC: 0.5,
          spvlD: 0.6,
        },
      });
    });
  }

  const [sort, setSort] = useState<string>();
  const [alignTips, setAlignTips] = useState<string>("left");
  const [isShowInternalNode, setIsShowInternalNode] = useState<boolean>(false);
  const [isShowScale, setIsShowScale] = useState<boolean>(false);
  const [isShowLabel, setIsShowLabel] = useState<boolean>(true);
  const [isShowBranchLength, setIsShowBranchLength] = useState<boolean>(false);
  const [searchingFilter, setSearchingFilter] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "name", value: "" }]);
  const [isExportNewick, setIsExportNewick] = useState<boolean>(false);
  const [reloadState, setReloadState] = useState<boolean>(false);

  useEffect(() => {
    setSort("ascending");
    setAlignTips("left");
    setIsShowInternalNode(false);
    setIsShowScale(false);
    setIsShowLabel(true);
    setIsShowBranchLength(false);
    setSearchingFilter([{ key: "name", value: "" }]);
  }, [reloadState]);

  return (
    <div>
      <div className="button-group">
        <button
          type="button"
          onClick={() => {
            setReloadState(true);
          }}
          title="Reload"
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        <button
          type="button"
          onClick={() => {
            setSort("ascending");
          }}
          title="Sort ascending"
        >
          <FontAwesomeIcon icon={faSortAmountUp} flip="vertical" />
        </button>
        <button
          type="button"
          onClick={() => {
            setSort("descending");
          }}
          title="Sort descending"
        >
          <FontAwesomeIcon icon={faSortAmountUp} />
        </button>
        <button
          type="button"
          onClick={() => {
            setAlignTips("left");
          }}
          title="Align tips left"
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button
          type="button"
          onClick={() => {
            setAlignTips("right");
          }}
          title="Align tips right"
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowInternalNode(!isShowInternalNode);
          }}
        >
          {isShowInternalNode ? "Hide internal node" : "Show internal node"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowLabel(!isShowLabel);
          }}
        >
          {isShowLabel ? "Hide label" : "Show label"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowScale(!isShowScale);
          }}
        >
          {isShowScale ? "Hide scale" : "Show scale"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowBranchLength(!isShowBranchLength);
          }}
        >
          {isShowBranchLength ? "Hide branch length" : "Show branch length"}
        </button>
        <button
          type="button"
          onClick={() => {
            exportImage();
          }}
        >
          Export image
        </button>
        <button
          type="button"
          onClick={() => {
            setIsExportNewick(true);
          }}
        >
          Export newick
        </button>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        {searchingFilter.map((filter, index) => (
          <div key={index}>
            {index > 0 ? (
              <input
                type="text"
                placeholder="Key"
                value={filter.key}
                onChange={(event) => {
                  const newFilter = [...searchingFilter];
                  newFilter[index].key = event.target.value;
                  setSearchingFilter(newFilter);
                }}
              />
            ) : (
              <div>Name</div>
            )}
            <input
              type="text"
              placeholder="Value"
              value={filter.value}
              onChange={(event) => {
                const newFilter = [...searchingFilter];
                newFilter[index].value = event.target.value;
                setSearchingFilter(newFilter);
              }}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newFilter = [...searchingFilter];
                  newFilter.splice(index, 1);
                  setSearchingFilter(newFilter);
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setSearchingFilter([...searchingFilter, { key: "", value: "" }]);
          }}
        >
          Add filter
        </button>
      </form>
      <PhylotreeVisualization
        input={newick}
        metadata={metadata}
        supportValueInput
        sort={sort}
        alignTips={alignTips}
        isShowInternalNode={isShowInternalNode}
        isShowScale={isShowScale}
        isShowLabel={isShowLabel}
        isShowBranchLength={isShowBranchLength}
        isExportNewick={isExportNewick}
        setIsExportNewick={setIsExportNewick}
        reloadState={reloadState}
        setReloadState={setReloadState}
        tooltip={showToolTip}
        searchingFilter={searchingFilter}
      />
    </div>
  );
};

export default App;
