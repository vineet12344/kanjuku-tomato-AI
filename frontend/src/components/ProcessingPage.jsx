import React from "react";

const ProcessingPage = ({ file }) => (
  <div className="processing-view">
    <img src={file.preview} alt="Preview" className="preview-image" style={{ width: "20%" }} />
    <h2>Detecting Ripeness...</h2>
  </div>
);

export default ProcessingPage;