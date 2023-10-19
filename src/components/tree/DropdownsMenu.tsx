import React, { FunctionComponent, useState } from "react";

import "../styles/AddAnnotationPopup.css";

const AddAnnotationPopup = ({
  onAddAnnotation,
  onCancel,
}: {
  onAddAnnotation: any;
  onCancel: any;
}) => {
  const [annotationText, setAnnotationText] = useState("");

  const handleInputChange = (event: any) => {
    setAnnotationText(event.target.value);
  };

  const handleAddAnnotation = () => {
    onAddAnnotation(annotationText);
    setAnnotationText("");
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Add Annotation</h3>
        <input
          type="text"
          value={annotationText}
          onChange={handleInputChange}
          className="popup-input"
        />
        <div className="popup-buttons">
          <button onClick={handleAddAnnotation} className="popup-button">
            OK
          </button>
          <button onClick={onCancel} className="popup-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export interface IDropdownsMenuProps {
  x: number;
  y: number;
  node: any;
  reRootFunction: any;
  isLeaf?: boolean;
  toggleCollapse: any;
  viewSubtree: any;
  toggleHighlightBranch: any;
  addAnnotation?: any;
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
    addAnnotation,
  } = props;

  const [showAddAnnotationPopup, setShowAddAnnotationPopup] = useState(false);

  const handleAddAnnotation = (annotationText: string) => {
    addAnnotation(node, annotationText);
    setShowAddAnnotationPopup(false);
  };

  const handleCancelAddAnnotation = () => {
    setShowAddAnnotationPopup(false);
  };

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
      {node && addAnnotation ? (
        <a
          className="dropdown-item"
          tabIndex={-1}
          onClick={() => {
            setShowAddAnnotationPopup(true);
          }}
        >
          Add annotation
        </a>
      ) : null}
      {showAddAnnotationPopup && (
        <AddAnnotationPopup
          onAddAnnotation={handleAddAnnotation}
          onCancel={handleCancelAddAnnotation}
        />
      )}
    </div>
  );
};

export default DropdownsMenu;
