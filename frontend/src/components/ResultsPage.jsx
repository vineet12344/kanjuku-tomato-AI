import React from "react";
import upload from "../assets/upload.png";
import github_img from "../assets/github.png";

const ResultsPage = ({ result, onRetry }) => {
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "4rem 6rem",
    fontFamily: "'Instrument Serif', serif",
    position: "relative",
  };

  const leftStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const rightStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    marginLeft: "5%",
  };

  const titleStyle = {
    fontWeight: 100,
    fontSize: "48px",
    textAlign: "start",
    marginBottom: "1rem",
  };

  const headingStyle = {
    fontWeight: 100,
    fontSize: "70px",
    textAlign: "start",
    margin: "2rem 0",
  };

  const listStyle = {
    listStyle: "none",
    textAlign: "start",
    lineHeight: "50px",
    marginLeft: "0",
    fontSize: "1.2rem",
  };

  const paragraphStyle = {
    marginTop: "3rem",
    textAlign: "start",
    fontSize: "1rem",
    color: "#ccc",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "40px",
    width: "230px",
    height: "65px",
    backgroundColor: "#007bff",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontSize: "18px",
    marginTop: "1rem",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#0056d1",
    transform: "scale(1.05)",
  };

  const imageStyle = {
    borderRadius: "10px",
    maxWidth: "400px",
    width: "80%",
    objectFit: "contain",
  };

  const githubLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#fff",
    textDecoration: "none",
    position: "absolute",
    top: "2rem",
    right: "3rem",
    fontSize: "1.1rem",
    opacity: 0.9,
  };

  const githubIconStyle = {
    width: "24px",
    height: "24px",
    filter: "brightness(0) invert(1)",
  };

  return (
    <div style={containerStyle}>
      {/* LEFT SECTION */}
      <div style={leftStyle}>
        <h1 style={titleStyle}>AI Tomato Ripeness Detector</h1>
        <h2 style={headingStyle}>Results</h2>

        <ul style={listStyle}>
          <li>
            <b>Decision:</b> {result.ripeness}
          </li>
          <li>
            <b>Number of tomatoes detected:</b> {result.count || 4}
          </li>
          <li>
            <b>Overall Confidence:</b>{" "}
            {(result.confidence * 100).toFixed(1)}%
          </li>
        </ul>

        <p style={paragraphStyle}>Want to try one more?</p>

        {/* Upload Button */}
        <button
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={onRetry}
        >
          <img src={upload} alt="Upload" width="24" />
          Upload Image
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div style={rightStyle}>
        <a
          href="https://github.com/vineet12344/kanjuku-tomato-AI"
          target="_blank"
          rel="noopener noreferrer"
          style={githubLinkStyle}
        >
          <img src={github_img} alt="GitHub" style={githubIconStyle} />
          GitHub
        </a>

        {result.output_image && (
          <img
            src={result.output_image}
            alt="Detection Output"
            style={imageStyle}
          />
        )}
        {result.confusion_matrix && (
          <img
            src={result.confusion_matrix}
            alt="Confusion Matrix"
            style={imageStyle}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
