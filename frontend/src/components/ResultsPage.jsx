import React, { useRef } from "react";
import upload from "../assets/upload.png";
import github_img from "../assets/github.png";

const ResultsPage = ({ result, onRetry }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onRetry(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <div style={styles.header}>
        <h1
          style={styles.title}
          onClick={() => onRetry(null)}
          onMouseOver={(e) => (e.target.style.color = "#7a7a7aff")}
          onMouseOut={(e) => (e.target.style.color = "#fff")}
        >
          AI Tomato Ripeness Detector
        </h1>

        <a
          href="https://github.com/vineet12344/kanjuku-tomato-AI"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.githubLink}
        >
          <img src={github_img} alt="GitHub" style={styles.githubIcon} />
          GitHub
        </a>
      </div>

      {/* --- CONTENT --- */}
      <div style={styles.content}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2 style={styles.heading}>Results</h2>

          <ul style={styles.list}>
            <li>
              <b>Decision:</b> {result.ripeness || "Ripe"}
            </li>
            <li>
              <b>Number of tomatoes detected:</b> {result.count || 4}
            </li>
            <li>
              <b>Overall Confidence:</b>{" "}
              {result.confidence
                ? (result.confidence * 100).toFixed(1) + "%"
                : "—"}
            </li>
          </ul>

          <p style={styles.note}>Want to try one more?</p>
          <button
            style={styles.button}
            onClick={handleUploadClick}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0068e6")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            <img src={upload} alt="Upload" width="24" />
            Upload Image
          </button>

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          {result.output_image && (
            <img
              src={result.output_image}
              alt="Detection Output"
              style={styles.image}
            />
          )}
          {result.confusion_matrix && (
            <img
              src={result.confusion_matrix}
              alt="Confusion Matrix"
              style={styles.confusion}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Instrument Serif', serif",
    padding: "2rem 4rem",
    overflow: "hidden", // ✅ Prevent scrollbars
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between", // ✅ Align title & GitHub in one line
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: 300,
    fontSize: "48px",
    cursor: "pointer",
    color: "#fff",
    transition: "color 0.3s ease",
    margin: 0,
  },
  githubLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.2rem",
    opacity: 0.9,
    marginRight: "2rem",
  },
  githubIcon: {
    width: "24px",
    height: "24px",
    filter: "brightness(0) invert(1)",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "3rem",
    width: "100%",
  },
  left: {
    flex: 1,
    textAlign: "left",
  },
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2rem",
    textAlign: "right",
  },
  heading: {
    fontWeight: 400,
    fontSize: "64px",
    marginBottom: "2rem",
  },
  list: {
    listStyle: "none",
    lineHeight: "2.2rem",
    fontSize: "1.2rem",
    paddingLeft: 0,
  },
  note: {
    marginLeft: "7%",
    marginTop: "3rem",
    fontSize: "1rem",
    color: "#ccc",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "40px",
    width: "220px",
    height: "60px",
    backgroundColor: "#007bff",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontSize: "18px",
    marginTop: "1.5rem",
    transition: "all 0.3s ease",
  },
  image: {
    borderRadius: "12px",
    maxWidth: "480px",
    width: "90%",
    objectFit: "cover",
    boxShadow: "0 0 25px rgba(255,255,255,0.2)",
  },
  confusion: {
    borderRadius: "12px",
    maxWidth: "420px",
    width: "85%",
    objectFit: "contain",
    boxShadow: "0 0 25px rgba(255,255,255,0.15)",
  },
};

export default ResultsPage;