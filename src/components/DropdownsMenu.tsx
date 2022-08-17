import React, { FunctionComponent } from "react";

export interface IDropdownsMenuProps {
  left: number;
  top: number;
  currentNode: any;
  reRootFunction: any;
  isLeaf?: boolean;
  toggleCollapse: any;
}

const DropdownsMenu: FunctionComponent<IDropdownsMenuProps> = (props) => {
  const {
    left = 0,
    top = 0,
    currentNode = null,
    isLeaf = false,
    reRootFunction,
    toggleCollapse,
  } = props;

  return (
    <div
      className="dropdown-menu"
      role="menu"
      style={{
        left,
        top,
        position: "fixed",
        display: "block",
      }}
    >
      {currentNode && !isLeaf ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            toggleCollapse(currentNode);
          }}
        >
          {currentNode.collapsed ? "Expand subtree" : "Collapse subtree"}
        </a>
      ) : null}
      {currentNode ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            reRootFunction(currentNode);
          }}
        >
          Reroot on this node
        </a>
      ) : null}
    </div>
  );
};

export default DropdownsMenu;
