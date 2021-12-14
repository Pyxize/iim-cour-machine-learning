import { useState, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from "react-webcam";
import {drawHand} from "./tool/tool";

function App() {
  const [count, setCount] = useState(0)
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    // Boucle pour detecter la main
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set la webcam
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set le canvas
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // detection de la main
      const hand = await net.estimateHands(video);
     // console.log(hand);

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandpose()
  return (
    <div className="App">
      coucou
      <div className="App">
        <header className="App-header">
          <Webcam
              ref={webcamRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
          />

          <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
          />
        </header>
      </div>
    </div>
  )
}

export default App
