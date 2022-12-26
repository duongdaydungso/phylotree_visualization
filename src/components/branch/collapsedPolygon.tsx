import React from "react";

function CollapsedPolygon({ x, y }: { x: number; y: number }) {
  const pointPolygon: any = [
    [x + 18, y + 10],
    [x - 2, y],
    [x + 18, y - 10],
  ];

  return <polygon points={pointPolygon} fill="grey" />;
}

export default CollapsedPolygon;
