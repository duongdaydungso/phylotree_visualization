import React, { FunctionComponent, useState, useEffect } from "react";

import "./styles/PhylotreeVisualization.css";

import PhylogeneticTree from "./tree/PhylogeneticTree";

import FileSaver from "file-saver";

import "bootstrap/dist/css/bootstrap.min.css";

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
  defaultHeight?: number;
  sort?: string | null;
  alignTips?: string;
  isShowInternalNode?: boolean;
  isShowScale?: boolean;
  isShowLabel?: boolean;
  isShowBranchLength?: boolean;
  searchingLabel?: string;
  isExportNewick?: boolean;
  setIsExportNewick?: React.Dispatch<React.SetStateAction<boolean>>;
  reloadState?: boolean;
  setReloadState?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PhylotreeVisualization: FunctionComponent<
  IPhylotreeVisualizationProps
> = (props) => {
  const {
    supportValueInput = null,
    defaultWidth = null,
    defaultHeight = null,
    sort = null,
    alignTips = "left",
    isShowInternalNode = false,
    isShowScale = false,
    isShowLabel = true,
    isShowBranchLength = false,
    searchingLabel = "",
  } = props;

  const padding = 20;
  const widthPerNode = 200;
  const heightPerNode = 20;

  // State
  const [newickString, setNewickString] = useState<string>();
  const [supportValue, setSupportValue] = useState<Array<object> | null>(null);
  const [nodeNum, setNodeNum] = useState<number>(0);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [reloadState, setReloadState] = useState<boolean>(false);

  // Function
  const resetState = () => {
    setNewickString("");
    setSupportValue(null);
    setNodeNum(0);
    setReloadState(true);
  };

  const initTree = () => {
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
  };

  const exportNewick = (filename?: string) => {
    if (!newickString) return;

    let pattern = /\/+[0-9]+:/g;
    let tmpResult = newickString.replace(pattern, ":");

    let result = tmpResult.replace("{highlight}", "");

    var blob = new Blob([result], {
      type: "text/plain;charset=utf-8",
    });

    const treefileName = filename ? filename : "phylotree.treefile";

    FileSaver.saveAs(blob, treefileName);
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
    resetState();
  }, [props.input, supportValueInput]);

  useEffect(() => {
    if (props.reloadState && props.setReloadState) {
      resetState();
      props.setReloadState(false);
    }
  }, [props.reloadState]);

  useEffect(() => {
    initTree();
    setReloadState(false);
  }, [reloadState]);

  useEffect(() => {
    if (nodeNum) {
      setWidth(Math.log2(nodeNum) * widthPerNode + 2 * padding);
      setHeight(nodeNum * heightPerNode + 2 * padding);
    }
  }, [nodeNum]);

  useEffect(() => {
    if (props.isExportNewick && props.setIsExportNewick) {
      exportNewick();
      props.setIsExportNewick(false);
    }
  }, [props.isExportNewick]);

  // Render
  return (
    <div className="pv-container">
      <div className="tool-group">
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
          height={defaultHeight ? defaultHeight : height - 2 * padding}
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
