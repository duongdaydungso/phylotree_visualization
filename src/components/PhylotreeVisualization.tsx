import React, { FunctionComponent, useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";

import PhylogeneticTree from "./PhylogeneticTree";

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
} from "@fortawesome/free-solid-svg-icons";

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

export interface IPhylotreeVisualizationProps {
  input: string;
}

export const PhylotreeVisualization: FunctionComponent<
  IPhylotreeVisualizationProps
> = (props) => {
  const padding = 20;
  const widthPerNode = 150;
  const heightPerNode = 15;

  // State
  const [newickString, setNewickString] = useState<string>();
  const [nodeNum, setNodeNum] = useState<number>(0);
  const [width, setWidth] = useState<number>(500);
  const [minWidth, setMinWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [minHeight, setMinHeight] = useState<number>(500);
  const [sort, setSort] = useState<string | null>(null);
  const [alignTips, setAlignTips] = useState<string>("left");
  const [isShowInternalNode, setIsShowInternalNode] = useState<boolean>(false);

  const [reloadState, setReloadState] = useState<boolean>(false);

  // Base states
  const baseStates = {
    newickString: "",
    nodeNum: 0,
    sort: null,
    alignTips: "left",
    isShowInternalNode: false,
  };

  const setBaseStates = () => {
    setNewickString(baseStates.newickString);
    setNodeNum(baseStates.nodeNum);
    setSort(baseStates.sort);
    setAlignTips(baseStates.alignTips);
    setIsShowInternalNode(baseStates.isShowInternalNode);
    setReloadState(true);
  };

  // Update
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

    setNodeNum(id / 2);
    setNewickString(result_newick);

    setReloadState(false);
  }, [props.input, reloadState]);

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
    <div
      className="pv-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
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
        </ButtonGroup>
        <div style={{ margin: "0px 20px" }}>
          <input
            type="checkbox"
            onChange={(e) => setIsShowInternalNode(!isShowInternalNode)}
            checked={isShowInternalNode}
          />
          {!isShowInternalNode ? " Hide" : " Show"} internal labels
        </div>
      </div>
      {newickString ? (
        <PhylogeneticTree
          newickString={newickString}
          setNewickString={setNewickString}
          width={width - 2 * padding}
          height={height - 2 * padding}
          padding={padding}
          alignTips={alignTips}
          sort={sort}
          isShowInternalNode={isShowInternalNode}
        />
      ) : null}
    </div>
  );
};
