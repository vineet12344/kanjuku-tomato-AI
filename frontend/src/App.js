import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useDropzone } from "react-dropzone";
import "./App.css";
import Loading from "./components/Loading";
import HeroPage from "./components/HeroPage";
import ProcessingPage from "./components/ProcessingPage";
import ResultsPage from "./components/ResultsPage";

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
  background-color: #ff6347;
`;

const Count = styled.p`
  position: absolute;
  font-size: 130px;
  font-weight: 800;
  color: #fff;
  transform: translateY(-15px);
  z-index: 2;
`;

function App() {
  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState("hero"); // "hero" | "processing" | "results"
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    file.preview = URL.createObjectURL(file);
    setUploadedFile(file);
    setPage("processing");
    handleUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      const formatted = {
        ripeness: "Ripe",
        count: data.detections.length,
        confidence:
          data.detections.reduce((acc, d) => acc + d.confidence, 0) /
          data.detections.length,
        output_image: `data:image/jpeg;base64,${data.annotated_image}`,
      };

      setResult(formatted);
      setPage("results");

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed");
      setPage("hero");
    }
  };


  // --- Counter animation ---
  useEffect(() => {
    const count = setInterval(() => {
      setCounter((prev) => (prev < 100 ? prev + 1 : 100));
    }, 25);
    return () => clearInterval(count);
  }, []);

  // --- GSAP page transition after load ---
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

  // --- GSAP between pages ---
  useEffect(() => {
    gsap.fromTo(
      ".page",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [page]);

  return (
    <div>
      {/* LOADING SCREEN */}
      <Loading>
        <ProgressBar className="progress-bar" style={{ width: counter + "%" }} />
        <Count className="count">{counter}%</Count>
      </Loading>

      {/* MAIN CONTENT */}
      <Content className="content">
        <div className="page">
          {page === "hero" && (
            <HeroPage
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          )}
          {page === "processing" && uploadedFile && <ProcessingPage file={uploadedFile} />}
          {page === "results" && result && <ResultsPage result={result} />}
        </div>
      </Content>
    </div>
  );
}

export default App;