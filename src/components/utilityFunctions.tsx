import FileSaver from "file-saver";
import saveSvgAsPng from "save-svg-as-png";

export function exportNewick({ tree }: { tree: any }) {
  const newickString = tree.current.state.newickString;

  if (!newickString) return;

  let pattern = /\/+[0-9]+:/g;
  let tmpResult = newickString.replace(pattern, ":");

  let result = tmpResult.replace("{highlight}", "");

  var blob = new Blob([result], {
    type: "text/plain;charset=utf-8",
  });

  FileSaver.saveAs(blob, "newick.treefile");
}

const imageOptions = {
  scale: 5,
  encoderOptions: 1,
  backgroundColor: "white",
};

export function downloadImage() {
  const tempSourceElement = document.getElementById("svg-phylotree");

  if (tempSourceElement === null) return;

  saveSvgAsPng.saveSvgAsPng(tempSourceElement, "shapes.png", imageOptions);
}

export function setWidthTree({
  tree,
  widthLength,
}: {
  tree: any;
  widthLength: number;
}) {
  tree.current.setState({
    width: widthLength,
  });
}

export function setHeightTree({
  tree,
  heightLength,
}: {
  tree: any;
  heightLength: number;
}) {
  tree.current.setState({
    height: heightLength,
  });
}

export function setSortTree({
  tree,
  sortType,
}: {
  tree: any;
  sortType: string | null;
}) {
  tree.current.setState({
    sort: sortType,
  });
}

export function setAlignTipsTree({
  tree,
  alignTipsType,
}: {
  tree: any;
  alignTipsType: string;
}) {
  tree.current.setState({
    alignTips: alignTipsType,
  });
}

export function setIsShowLabelTree({
  tree,
  isShowLabel,
}: {
  tree: any;
  isShowLabel: boolean;
}) {
  tree.current.setState({
    isShowLabel: isShowLabel,
  });
}

export function setIsShowScaleTree({
  tree,
  isShowScale,
}: {
  tree: any;
  isShowScale: boolean;
}) {
  tree.current.setState({
    isShowScale: isShowScale,
  });
}

export function setIsShowBranchLengthTree({
  tree,
  isShowBranchLength,
}: {
  tree: any;
  isShowBranchLength: boolean;
}) {
  tree.current.setState({
    isShowBranchLength: isShowBranchLength,
  });
}

export function setIsShowInternalNodeTree({
  tree,
  isShowInternalNode,
}: {
  tree: any;
  isShowInternalNode: boolean;
}) {
  tree.current.setState({
    isShowInternalNode: isShowInternalNode,
  });
}
