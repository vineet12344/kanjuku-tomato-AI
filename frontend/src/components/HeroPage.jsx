import React from "react";
import upload from "../assets/upload.png";
import github_img from "../assets/github.png";
import tomato_img from "../assets/Hero_Image.png";

const HeroPage = ({ getRootProps, getInputProps, isDragActive }) => {
  return (
    <div className="hero-section">
      {/* LEFT */}
      <div {...getRootProps()} className="left-column">
        <h1 className="title-main">AI Tomato Ripeness<br />Detector</h1>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <button className="cta-button">
            <img src={upload} alt="Upload Image" />
            <p>Upload Image</p>
          </button>
        )}
      </div>

      {/* RIGHT */}
      <div className="right-column">
        <a
          href="https://github.com/vineet12344/kanjuku-tomato-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img src={github_img} alt="GitHub Icon" />
          <p>GitHub</p>
        </a>
        <img src={tomato_img} alt="Ripe tomatoes" style={{ height: "300px" }} />
      </div>
    </div>
  );
};

export default HeroPage;
