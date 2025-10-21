import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import gsap from "gsap";
import './App.css';
import Loading from './components/Loading';
import github_img from './assets/github.png';
import tomato_img from './assets/Hero_Image.png';
import upload from './assets/upload.png';
import {useDropzone} from 'react-dropzone'


// --- Styled Components ---
const Content = styled.div`
  opacity: 0; /* Hidden by default */
  padding: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const Follow = styled.div`
  position: absolute;
  background-color: #828282ff;
  height: 2px;
  width: 0;
  left: 0;
  z-index: 2;
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
  color: #ffffffff;
  transform: translateY(-15px);
  z-index: 2;
  display: inline-block;
  background-color: transparent;
`;

// --- Main App Component ---
function App() {
  const [counter, setCounter] = useState(0);
  const ctaButtonRef = useRef(null);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  // Effect for the counter
  useEffect(() => {
    const count = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter < 100) {
          return prevCounter + 1;
        } else {
          clearInterval(count);
          return 100;
        }
      });
    }, 25);

    return () => clearInterval(count);
  }, []); // <-- IMPORTANT: Empty dependency array

  // Effect for the GSAP animation
  useEffect(() => {
    if (counter === 100) {
      const tl = gsap.timeline();

      // Animate the text and progress bar out
      tl.to(".count", { duration: 0.4, opacity: 0, y: -100 })
        .to(".progress-bar", { duration: 0.8, width: "0%" }, "-=0.2");

      // Animate the loading screen up
      tl.to(".loading-screen", {
        duration: 1,
        y: "-100%",
        ease: "power3.inOut",
      });
      
      // Animate the main content in
      tl.to(".content", {
          duration: 0.8,
          opacity: 1,
          ease: "power2.out"
      }, "-=0.5"); // Overlap for a smoother transition
    }
  }, [counter]); // <-- This effect runs whenever 'counter' changes

  return (
    <div>
      <Loading key="loading">
        <ProgressBar className="progress-bar" style={{ width: counter + "%" }}></ProgressBar>
        <Count className="count">{counter}%</Count>
      </Loading>
      

      <Content className="content">
        
        <div className='hero-section'>
          
          {/* Left Column */}
          <div {...getRootProps()} className='left-column'>
            <h1 className='title-main'>
              AI Tomato Ripeness<br />Detector
            </h1>
            <input  {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p><button className='cta-button' ref={ctaButtonRef}>
              <img src={upload} alt="Upload Image" />
              <p>Upload Image</p>
            </button></p>
            }
            
          </div>

          {/* Right Column */}
          <div className='right-column'>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className='github-link'>
              <img src={github_img} alt="GitHub Icon" />
              <p>GitHub</p>
            </a>
            <img src={tomato_img} alt="Ripe tomatoes" style={{height:"300px"}} />
          </div>

        </div>
      </Content>
    </div>
  );
}

export default App;