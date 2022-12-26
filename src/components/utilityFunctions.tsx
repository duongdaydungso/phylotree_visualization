import FileSaver from "file-saver";
import saveSvgAsPng from "save-svg-as-png";

export function exportNewick(tree: any, filename?: string) {
  console.log(tree.current);

  const newickString = tree.current.state.newickString;

  if (!newickString) return;

  let pattern = /\/+[0-9]+:/g;
  let tmpResult = newickString.replace(pattern, ":");

  let result = tmpResult.replace("{highlight}", "");

  var blob = new Blob([result], {
    type: "text/plain;charset=utf-8",
  });

  const treefileName = filename ? filename : "phylotree.treefile";

  FileSaver.saveAs(blob, treefileName);
}

export function exportImage(filename?: string) {
  const imageOptions = {
    scale: 5,
    encoderOptions: 1,
    backgroundColor: "white",
  };

  const tempSourceElement = document.getElementById("svg-phylotree");

  if (tempSourceElement === null) return;

  const imageName = filename ? filename : "phylotree.png";

  saveSvgAsPng.saveSvgAsPng(tempSourceElement, imageName, imageOptions);
}
