import React, { FunctionComponent } from "react";

export interface IDropdownsMenuProps {
  x: number;
  y: number;
  node: any;
  reRootFunction: any;
  isLeaf?: boolean;
  toggleCollapse: any;
  viewSubtree: any;
  toggleHighlightBranch: any;
}

const DropdownsMenu: FunctionComponent<IDropdownsMenuProps> = (props) => {
  const {
    x = 0,
    y = 0,
    node = null,
    isLeaf = false,
    reRootFunction,
    toggleCollapse,
    viewSubtree,
    toggleHighlightBranch,
  } = props;

  return (
    <div
      className="dropdown-menu"
      role="menu"
      style={{
        left: x + 20,
        top: y - 20,
        position: "fixed",
        display: "block",
      }}
    >
      {node ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            toggleHighlightBranch(node);
          }}
        >
          Toggle highlight this branch
        </a>
      ) : null}
      {node && !isLeaf ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            viewSubtree(node);
          }}
        >
          Display subtree
        </a>
      ) : null}
      {node && !isLeaf ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            toggleCollapse(node);
          }}
        >
          {node.collapsed ? "Expand subtree" : "Collapse subtree"}
        </a>
      ) : null}
      {node ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            reRootFunction(node);
          }}
        >
          Reroot on this node
        </a>
      ) : null}
    </div>
  );
};

export default DropdownsMenu;
