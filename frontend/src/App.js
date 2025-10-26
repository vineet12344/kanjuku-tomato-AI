import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import gsap from "gsap";
import './App.css';
import Loading from './components/Loading';
import Processing from './components/Processing'
import github_img from './assets/github.png';
import tomato_img from './assets/Hero_Image.png';
import upload from './assets/upload.png';
import { useDropzone } from 'react-dropzone';

// --- Styled Components ---
const Content = styled.div`
  opacity: 0;
  padding: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #FF6347;
`;

const Count = styled.p`
  position: absolute;
  font-size: 130px;
  font-weight: 800;
  color: #fff;
  transform: translateY(-15px);
  z-index: 2;
  display: inline-block;
  background-color: transparent;
`;

function App() {
  const [counter, setCounter] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const ctaButtonRef = useRef(null);

  // --- Dropzone handler ---
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    file.preview = URL.createObjectURL(file);
    setUploadedFile(file);
    handleUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // --- Upload and backend communication ---
  const handleUpload = async (file) => {
    setProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      // Assuming backend sends JSON + base64 image:
      // { "ripeness": "ripe", "confidence": 0.95, "output_image": "data:image/png;base64,..." }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setProcessing(false);
    }
  };

  // --- Counter animation ---
  useEffect(() => {
    const count = setInterval(() => {
      setCounter((prev) => (prev < 100 ? prev + 1 : 100));
    }, 25);
    return () => clearInterval(count);
  }, []);

  useEffect(() => {
    if (counter === 100) {
      const tl = gsap.timeline();
      tl.to(".count", { duration: 0.4, opacity: 0, y: -100 })
        .to(".progress-bar", { duration: 0.8, width: "0%" }, "-=0.2")
        .to(".loading-screen", {
          duration: 1,
          y: "-100%",
          ease: "power3.inOut",
        })
        .to(".content", {
          duration: 0.8,
          opacity: 1,
          ease: "power2.out",
        }, "-=0.5");
    }
  }, [counter]);

  return (
    <div>
      {/* --- LOADING SCREEN --- */}
      <Loading key="loading">
        <ProgressBar className="progress-bar" style={{ width: counter + "%" }}></ProgressBar>
        <Count className="count">{counter}%</Count>
      </Loading>

      {/* --- MAIN CONTENT --- */}
      <Content className="content">
        <div className="hero-section">
          {/* LEFT COLUMN */}
          <div {...getRootProps()} className="left-column">
            <h1 className="title-main">
              AI Tomato Ripeness<br />Detector
            </h1>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                <button className="cta-button" ref={ctaButtonRef}>
                  <img src={upload} alt="Upload Image" />
                  <p>Upload Image</p>
                </button>
              </p>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="github-link">
              <img src={github_img} alt="GitHub Icon" />
              <p>GitHub</p>
            </a>
            <img src={tomato_img} alt="Ripe tomatoes" style={{ height: "300px" }} />
          </div>
        </div>

        {/* --- CONDITIONAL RENDER --- */}
        {uploadedFile && processing && <Processing file={uploadedFile} />}
        {result && (
          <div className="results-section">
            <h2>Detection Results</h2>
            <p><b>Ripeness:</b> {result.ripeness}</p>
            <p><b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%</p>
            <img src={result.output_image} alt="Processed Output" style={{ maxWidth: "400px", marginTop: "20px" }} />
          </div>
        )}
      </Content>
    </div>
  );
}

export default App;