import React, { FunctionComponent, useState, useEffect } from "react";

import "./styles/PhylotreeVisualization.css";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";

import PhylogeneticTree from "../tree/PhylogeneticTree";

import FileSaver from "file-saver";
import saveSvgAsPng from "save-svg-as-png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faRedo,
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faSortAmountUp,
  faAlignRight,
  faAlignLeft,
  faImage,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";

import displayTaxaNameButtonImage from "./styles/display_taxa_name_button.png";
import displayBranchLengthButtonImage from "./styles/display_branch_length_button.png";

function Reload(props: any) {
  return (
    <Button title="Reload tree" variant="secondary" {...props}>
      <FontAwesomeIcon key={1} icon={faRedo} />
    </Button>
  );
}

function HorizontalExpansionButton(props: any) {
  return (
    <Button
      variant="secondary"
      style={{ fontSize: 10 }}
      title="Expand horizontally"
      {...props}
    >
      <FontAwesomeIcon key={1} icon={faArrowLeft} />
      <FontAwesomeIcon key={2} icon={faArrowRight} />
    </Button>
  );
}

function HorizontalCompressionButton(props: any) {
  return (
    <Button
      variant="secondary"
      style={{ fontSize: 10 }}
      title="Compress horizontally"
      {...props}
    >
      <FontAwesomeIcon key={1} icon={faArrowRight} />
      <FontAwesomeIcon key={2} icon={faArrowLeft} />
    </Button>
  );
}

function VerticalExpansionButton(props: any) {
  return (
    <Button
      variant="secondary"
      style={{ fontSize: 10, display: "flex", flexDirection: "column" }}
      title="Expand vertically"
      {...props}
    >
      <FontAwesomeIcon key={1} icon={faArrowUp} />
      <FontAwesomeIcon key={2} icon={faArrowDown} />
    </Button>
  );
}

function VerticalCompressionButton(props: any) {
  return (
    <Button
      variant="secondary"
      style={{ fontSize: 10, display: "flex", flexDirection: "column" }}
      title="Compress vertically"
      {...props}
    >
      <FontAwesomeIcon key={1} icon={faArrowDown} />
      <FontAwesomeIcon key={2} icon={faArrowUp} />
    </Button>
  );
}

function AscendingSortButton(props: any) {
  return (
    <Button variant="secondary" title="Sort in ascending order" {...props}>
      <FontAwesomeIcon key={1} icon={faSortAmountUp} flip="vertical" />
    </Button>
  );
}

function DescendingSortButton(props: any) {
  return (
    <Button variant="secondary" title="Sort in descending order" {...props}>
      <FontAwesomeIcon key={1} icon={faSortAmountUp} />
    </Button>
  );
}

function AlignTipsRightButton(props: any) {
  return (
    <Button variant="secondary" title="Align tips to right" {...props}>
      <FontAwesomeIcon key={1} icon={faAlignRight} />
    </Button>
  );
}

function AlignTipsLeftButton(props: any) {
  return (
    <Button variant="secondary" title="Align tips to left" {...props}>
      <FontAwesomeIcon key={1} icon={faAlignLeft} />
    </Button>
  );
}

function ToggleDisplayTaxaName(props: any) {
  return (
    <Button
      title="Toggle the display of taxa names"
      variant="secondary"
      {...props}
    >
      <img src={displayTaxaNameButtonImage} width="20" />
    </Button>
  );
}

function ToggleDisplayBranchLength(props: any) {
  return (
    <Button
      title="Toggle the display of branch lengths"
      variant="secondary"
      {...props}
    >
      <img src={displayBranchLengthButtonImage} width="20" />
    </Button>
  );
}

function SaveNewickButton(props: any) {
  return (
    <Button title="Export to Newick" variant="secondary" {...props}>
      <FontAwesomeIcon key={1} icon={faFileExport} flip="vertical" />
    </Button>
  );
}

function DownloadImageButton(props: any) {
  return (
    <Button title="Save image" variant="secondary" {...props}>
      <FontAwesomeIcon key={1} icon={faImage} flip="vertical" />
    </Button>
  );
}

function ShowInternalLabel({
  isShowInternalNode,
  setIsShowInternalNode,
}: {
  isShowInternalNode: boolean;
  setIsShowInternalNode: any;
}) {
  return (
    <div className="toggle-checkbox">
      <input
        type="checkbox"
        onChange={(e) => setIsShowInternalNode(!isShowInternalNode)}
        checked={isShowInternalNode}
      />
      {!isShowInternalNode ? " Hide" : " Show"} internal labels
    </div>
  );
}

function ShowScale({
  isShowScale,
  setIsShowScale,
}: {
  isShowScale: boolean;
  setIsShowScale: any;
}) {
  return (
    <div className="toggle-checkbox">
      <input
        type="checkbox"
        onChange={(e) => setIsShowScale(!isShowScale)}
        checked={isShowScale}
      />
      {!isShowScale ? " Hide" : " Show"} scale bar
    </div>
  );
}

function ShowSearchLabel({
  searchingLabel,
  setSearchingLabel,
}: {
  searchingLabel: string;
  setSearchingLabel: any;
}) {
  return (
    <form
      className="label-searching-form"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        className="label-searching-form-input form-control"
        type="text"
        name="find node"
        placeholder="Search tree"
        value={searchingLabel}
        onChange={(event) => {
          setSearchingLabel(event.target.value);
        }}
      />
    </form>
  );
}

function ShowSupportValue({
  supportValue,
  setSupportValue,
}: {
  supportValue: Array<object> | null;
  setSupportValue: any;
}) {
  if (!supportValue) return null;

  return (
    <div className="tool-group-lower">
      {supportValue.map((spValue: any) => {
        return (
          <div className="spValChecker" key={"spVLnum " + spValue.index}>
            <input
              type="checkbox"
              onChange={() => {
                let tmpSPVL = [...supportValue];

                tmpSPVL[spValue.index] = {
                  supportValue: spValue.supportValue,
                  isShowing: !spValue.isShowing,
                  index: spValue.index,
                };

                setSupportValue(tmpSPVL);
              }}
              checked={spValue.isShowing}
            />
            <div className="spValLabel">
              {spValue.isShowing ? "Hide " : "Show "}
              {spValue.supportValue}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface IPhylotreeVisualizationProps {
  input: string;
  supportValueInput?: string;
  defaultWidth?: number;
}

export const PhylotreeVisualization: FunctionComponent<
  IPhylotreeVisualizationProps
> = (props) => {
  const { supportValueInput = null, defaultWidth = null } = props;

  const padding = 20;
  const widthPerNode = 200;
  const heightPerNode = 20;

  // State
  const [newickString, setNewickString] = useState<string>();
  const [supportValue, setSupportValue] = useState<Array<object> | null>(null);
  const [nodeNum, setNodeNum] = useState<number>(0);
  const [width, setWidth] = useState<number>(500);
  const [minWidth, setMinWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [minHeight, setMinHeight] = useState<number>(500);
  const [sort, setSort] = useState<string | null>(null);
  const [alignTips, setAlignTips] = useState<string>("left");
  const [isShowInternalNode, setIsShowInternalNode] = useState<boolean>(false);
  const [isShowScale, setIsShowScale] = useState<boolean>(false);
  const [isShowLabel, setIsShowLabel] = useState<boolean>(true);
  const [isShowBranchLength, setIsShowBranchLength] = useState<boolean>(false);
  const [reloadState, setReloadState] = useState<boolean>(false);
  const [searchingLabel, setSearchingLabel] = useState<string>("");

  // Base states
  const baseStates = {
    newickString: "",
    supportValue: null,
    nodeNum: 0,
    sort: null,
    alignTips: "left",
    isShowInternalNode: false,
    isShowLabel: true,
    isShowBranchLength: false,
    isShowScale: false,
    reloadState: true,
    searchingLabel: "",
  };

  const setBaseStates = () => {
    setNewickString(baseStates.newickString);
    setSupportValue(baseStates.supportValue);
    setNodeNum(baseStates.nodeNum);
    setSort(baseStates.sort);
    setAlignTips(baseStates.alignTips);
    setIsShowInternalNode(baseStates.isShowInternalNode);
    setIsShowScale(baseStates.isShowScale);
    setIsShowLabel(baseStates.isShowLabel);
    setIsShowBranchLength(baseStates.isShowBranchLength);
    setReloadState(baseStates.reloadState);
    setSearchingLabel(baseStates.searchingLabel);
  };

  // Function
  const handleExportNewick = () => {
    if (!newickString) return;

    let pattern = /\/+[0-9]+:/g;
    let tmpResult = newickString.replace(pattern, ":");

    let result = tmpResult.replace("{highlight}", "");

    var blob = new Blob([result], {
      type: "text/plain;charset=utf-8",
    });

    FileSaver.saveAs(blob, "newick.treefile");
  };

  const imageOptions = {
    scale: 5,
    encoderOptions: 1,
    backgroundColor: "white",
  };

  const handleDownloadImage = () => {
    const tempSourceElement = document.getElementById("svg-phylotree");

    if (tempSourceElement === null) return;

    saveSvgAsPng.saveSvgAsPng(tempSourceElement, "shapes.png", imageOptions);
  };

  const labelStyler = (nodeName: any) => {
    if (searchingLabel !== "") {
      var rx = new RegExp(searchingLabel, "i");

      const identifier = nodeName.search(rx);

      const fill = identifier !== -1 ? "red" : "black";

      return { fill };
    }
  };

  // Update
  useEffect(() => {
    setBaseStates();
  }, [props.input, supportValueInput]);

  useEffect(() => {
    let tmp_newick = props.input.split("");

    let result_array = props.input.split("");

    let id = 0;

    for (let i = 0; i < result_array.length; i++) {
      if (result_array[i] === ":") {
        tmp_newick.splice(i + id, 0, "/", id.toString());
        id += 2;
      }
    }

    const result_newick = tmp_newick.join("");

    if (supportValueInput) {
      const tempSPVLArray = supportValueInput.split("/");

      let resArray = new Array();
      let tmpCNT = 0;

      tempSPVLArray.forEach((tmp) => {
        resArray.push({
          supportValue: tmp,
          isShowing: false,
          index: tmpCNT,
        });

        tmpCNT++;
      });

      setSupportValue(resArray);
    } else setSupportValue(null);

    setNodeNum(id / 2);
    setNewickString(result_newick);

    setReloadState(false);
  }, [reloadState]);

  useEffect(() => {
    if (nodeNum) {
      setWidth(Math.log2(nodeNum) * widthPerNode + 2 * padding);
      setHeight(nodeNum * heightPerNode + 2 * padding);
      setMinWidth(Math.log2(nodeNum) * widthPerNode + 2 * padding);
      setMinHeight(nodeNum * heightPerNode + 2 * padding);
    }
  }, [nodeNum]);

  // Render
  return (
    <div className="pv-container">
      <div className="tool-group">
        <div className="tool-group-upper">
          <ButtonGroup style={{ display: "flex" }}>
            <Reload onClick={() => setBaseStates()} />
            <HorizontalExpansionButton
              onClick={() => setWidth(Math.max(width + widthPerNode, minWidth))}
            />
            <HorizontalCompressionButton
              onClick={() => setWidth(Math.max(width - widthPerNode, minWidth))}
            />
            <VerticalExpansionButton
              onClick={() =>
                setHeight(Math.max(height + widthPerNode, minHeight))
              }
            />
            <VerticalCompressionButton
              onClick={() =>
                setHeight(Math.max(height - widthPerNode, minHeight))
              }
            />
            <AscendingSortButton onClick={() => setSort("ascending")} />
            <DescendingSortButton onClick={() => setSort("descending")} />
            <AlignTipsLeftButton onClick={() => setAlignTips("left")} />
            <AlignTipsRightButton onClick={() => setAlignTips("right")} />
            <ToggleDisplayTaxaName
              onClick={() => {
                setIsShowLabel(!isShowLabel);
              }}
            />
            <ToggleDisplayBranchLength
              onClick={() => {
                setIsShowBranchLength(!isShowBranchLength);
              }}
            />
            <SaveNewickButton onClick={() => handleExportNewick()} />
            <DownloadImageButton onClick={() => handleDownloadImage()} />
          </ButtonGroup>

          <ShowInternalLabel
            isShowInternalNode={isShowInternalNode}
            setIsShowInternalNode={setIsShowInternalNode}
          />

          <ShowScale
            isShowScale={isShowScale}
            setIsShowScale={setIsShowScale}
          />

          <ShowSearchLabel
            searchingLabel={searchingLabel}
            setSearchingLabel={setSearchingLabel}
          />
        </div>

        <ShowSupportValue
          supportValue={supportValue}
          setSupportValue={setSupportValue}
        />
      </div>
      {newickString ? (
        <PhylogeneticTree
          newickString={newickString}
          setNewickString={setNewickString}
          width={defaultWidth ? defaultWidth : width - 2 * padding}
          height={height - 2 * padding}
          padding={padding}
          alignTips={alignTips}
          sort={sort}
          isShowInternalNode={isShowInternalNode}
          isShowLabel={isShowLabel}
          isShowBranchLength={isShowBranchLength}
          isShowScale={isShowScale}
          labelStyler={labelStyler}
          supportValue={supportValue}
          highlightBranches
        />
      ) : null}
    </div>
  );
};
