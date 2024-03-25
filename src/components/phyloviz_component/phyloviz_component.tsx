import React, { useContext, useEffect } from "react";
import { Context } from "../phyloviz_wrapper/phyloviz_wrapper";
import { PhyloVizSourceData } from "../../models/data.model";
import { AxisTop } from "d3-react-axis";
import SVG from "../tree/svg";

import Branch from "../branch/branch";
import { isInCollapsedList } from "../../utils";
import {
  MiniMap,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

export type PhyloVizComponentProps = {
  sourceData: PhyloVizSourceData;
};

export const PhyloVizComponent: React.FC<PhyloVizComponentProps> = ({
  sourceData,
}: PhyloVizComponentProps) => {
  const { state, settings, init } = useContext(Context);

  useEffect(() => {
    if (sourceData !== null && init) {
      init(sourceData);
    }
  });

  const {
    viewWidth: width,
    viewHeight: height,
    viewPadding: padding,
    maxLabelWidth,
    alignTips,
    isShowScale,
    isShowInternalNode,
    isShowLabel,
    isShowBranchLength,
  } = settings;

  const { tree, collapsedList, x_scale, y_scale, color_scale } = state;

  if (!tree || !x_scale || !y_scale) {
    return <div />;
  }

  var treeView = (
    <SVG
      id="svg-phylotree"
      width={width + 2 * padding}
      height={height + 2 * padding + (isShowScale ? 60 : 0)}
    >
      <g transform={`translate(${padding}, ${padding})`}>
        {isShowScale ? (
          <g>
            <AxisTop transform={`translate(0, 20)`} scale={x_scale} />
          </g>
        ) : null}
        <g transform={`translate(0, ${isShowScale ? 60 : 0})`}>
          {tree.links.map((link: any) => {
            const source_id = link.source.unique_id;
            const target_id = link.target.unique_id;
            const key = source_id + "," + target_id;
            const show_label =
              isShowInternalNode ||
              (isShowLabel && tree.isLeafNode(link.target));
            return (
              <Branch
                key={key}
                xScale={x_scale}
                yScale={y_scale}
                colorScale={color_scale}
                link={link}
                isShowLabel={show_label}
                isShowBranchLength={isShowBranchLength}
                maxLabelWidth={maxLabelWidth}
                width={width}
                alignTips={alignTips}
                isCollapsed={isInCollapsedList(collapsedList, link.target)}
                isLeaf={tree.isLeafNode(link.target)}
              />
            );
          })}
        </g>
      </g>
    </SVG>
  );

  return (
    <div>
      <TransformWrapper minScale={1} maxScale={200}>
        <div
          style={{
            position: "fixed",
            zIndex: 5,
            top: "50px",
            right: "50px",
          }}
        >
          <MiniMap width={200}>{treeView}</MiniMap>
        </div>
        <TransformComponent>{treeView}</TransformComponent>
      </TransformWrapper>
    </div>
  );
};
