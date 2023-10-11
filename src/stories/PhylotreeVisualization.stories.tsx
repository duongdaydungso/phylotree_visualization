import { type Meta, type StoryObj } from "@storybook/react";

import { PhylotreeVisualization } from "../components/PhylotreeVisualization";
import React from "react";

import "../App.css";
import App from "../App";

const meta: Meta<typeof PhylotreeVisualization> = {
  title: "PhylotreeVisualization",
  component: PhylotreeVisualization,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const newick =
  "(LngfishAu:0.1719701100,(LngfishSA:0.1886808867,LngfishAf:0.1644491074)100/100/1/100:0.1087920616,(Frog:0.2578038925,((((Turtle:0.2233271857,(Crocodile:0.3082539507,Bird:0.2315153950)97.5/96.7/1/97:0.0653098323)83.1/76.8/0.993/67:0.0358359250,Sphenodon:0.3469967273)41.2/53.5/0.552/50:0.0198995128,Lizard:0.3865087507)98.8/98.8/1/99:0.0751759947,(((Human:0.1855732387,(Seal:0.0948685218,(Cow:0.0818779989,Whale:0.1016071305)99.6/99.2/1/99:0.0405693917)71.1/70.3/0.983/68:0.0246111268)91.7/89/1/87:0.0334775846,(Mouse:0.0587317507,Rat:0.0906720496)100/100/1/100:0.1233749965)99.4/99.5/1/99:0.0604351787,(Platypus:0.1912926848,Opossum:0.1516743301)95/95.9/1/99:0.0379715595)100/100/1/100:0.1491564171)100/100/1/100:0.1294184984)99.8/100/1/100:0.0950509487);";

const getMetaData = () => {
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

  return metadata;
};

const metadata = getMetaData();

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

export const SimpleExample: Story = {
  args: {
    input: newick,
  },
};

export const MetadataWithTooltip: Story = {
  render: () => (
    <PhylotreeVisualization
      input={newick}
      metadata={metadata}
      tooltip={showToolTip}
    />
  ),
};

export const supportValue: Story = {
  args: {
    input: newick,
    supportValueInput: "spvlA/spvlB/spvlC/spvlD",
  },
};

export const FullFunction: Story = {
  render: () => <App />,
};
