import saveSvgAsPng from "save-svg-as-png";

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
