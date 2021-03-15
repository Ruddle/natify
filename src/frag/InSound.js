import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useAnimationFrame } from "./utils";
import Interp from "./Interp";

var cloneDeep = require("lodash.clonedeep");

async function getMedia() {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return stream;
  } catch (e) {
    console.error("getMedia: ", e);
    return null;
  }
}

function AudioBufferVisu({ audioBuffer }) {
  let canvasRef = useRef();

  useEffect(() => {
    let canvas = canvasRef.current;
    if (audioBuffer && canvas) {
      let ctx = canvas.getContext("2d");
      let w = canvas.width;
      let h = canvas.height;
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      let d = audioBuffer.getChannelData(0);
      console.log(d);
      function s2y(s) {
        return h - h * (s * 0.5 + 0.5);
      }
      ctx.moveTo(0, s2y(d[0]));
      for (let i = 0; i < d.length; i++) {
        ctx.lineTo((w * i) / (d.length - 1), s2y(d[i]));
      }
      ctx.strokeStyle = "#569cd6";
      ctx.stroke();
    }
  }, [audioBuffer]);

  if (!audioBuffer) return <div></div>;

  function fix(str) {
    return (str + "").padEnd(7, " ");
  }

  return (
    <div>
      <div style={{ whiteSpace: "pre" }}>
        {fix(Math.floor(audioBuffer.duration * 1000) / 1000) + " s"}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {fix(audioBuffer.length) + " samples"}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {fix(audioBuffer.numberOfChannels) + " channels"}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {fix(audioBuffer.sampleRate) + " Hz"}
      </div>
      <canvas width={110} height={30} ref={canvasRef}></canvas>
    </div>
  );
}

export default function InSound({ name, value, onChange }) {
  let [file, setFile] = useState();

  useEffect(() => {
    console.log(file);
    if (file) convertBlobToAudioBuffer(file);
  }, [file]);

  let [recorderState, setRecorderState] = useState({
    chunks: [],
    stream: null,
    mediaRecorder: null,
    started: false,
  });

  let [audioBuffer, setAudioBuffer] = useState();

  useEffect(() => {
    if (audioBuffer) onChange(audioBuffer.getChannelData(0));
  }, [audioBuffer]);

  let startRecord = useCallback(async () => {
    let { chunks, stream, mediaRecorder, started } = recorderState;
    if (!stream) stream = await getMedia();
    if (!mediaRecorder) mediaRecorder = new MediaRecorder(stream);
    if (!started) {
      chunks = [];
      mediaRecorder.start();
      mediaRecorder.ondataavailable = (e) => {
        console.log("DATA AVAILABLE");
        convertBlobToAudioBuffer(e.data);
        chunks.push(e.data);
      };
      started = true;
    }
    setRecorderState({ chunks, stream, mediaRecorder, started });
  }, [recorderState]);

  let stopRecord = useCallback(async () => {
    let { chunks, stream, mediaRecorder, started } = recorderState;
    if (stream && mediaRecorder && started) {
      started = false;
      mediaRecorder.stop();
    }

    setRecorderState({ chunks, stream, mediaRecorder, started });
  }, [recorderState]);

  function convertBlobToAudioBuffer(myBlob) {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      let myArrayBuffer = fileReader.result;
      audioContext.decodeAudioData(myArrayBuffer, (audioBuffer) => {
        setAudioBuffer(audioBuffer);
      });
    };
    fileReader.readAsArrayBuffer(myBlob);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "110px",
        height: "110px",
        padding: "5px",
      }}
    >
      <div
        style={{
          textAlign: "left",
          color: "grey",
          fontSize: "0.7em",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ border: "1px solid rgba(0,0,0,0)" }}>{name}</div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {!recorderState.started && (
            <div
              onClick={() => startRecord()}
              style={{
                border: "1px solid #3dc9b0",
                cursor: "pointer",
                flex: "1 1 auto",
                textAlign: "center",
                color: "#3dc9b0",
              }}
            >
              rec
            </div>
          )}
          {recorderState.started && (
            <div
              onClick={() => stopRecord()}
              style={{
                border: "1px solid #569cd6",
                cursor: "pointer",
                flex: "1 1 auto",
                textAlign: "center",
                color: "#569cd6",
              }}
            >
              stop
              <span
                style={{
                  marginLeft: "5px",
                  marginBottom: "1px",
                  display: "inline-block",
                  borderRadius: "50%",
                  width: "5px",
                  height: "5px",
                  backgroundColor: "red",
                }}
              ></span>
            </div>
          )}
          {!recorderState.started && (
            <>
              {" "}
              <label
                for={"file" + name}
                style={{
                  flex: "1 1 auto",
                  border: "1px solid #3dc9b0",
                  cursor: "pointer",
                  borderLeft: "none",
                  // borderRight: "none",
                  textAlign: "center",
                  color: "#3dc9b0",
                }}
              >
                file
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
                type="file"
                id={"file" + name}
                name="file"
                multiple
              ></input>{" "}
              {/* <div
                style={{
                  border: "1px solid #3dc9b0",
                  cursor: "pointer",
                  flex: "1 1 auto",
                  textAlign: "center",
                  color: "#3dc9b0",
                }}
              >
                link
              </div> */}
            </>
          )}
        </div>

        <AudioBufferVisu audioBuffer={audioBuffer}></AudioBufferVisu>
      </div>
    </div>
  );
}
