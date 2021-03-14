import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useAnimationFrame } from "./utils";
import Interp from "./Interp";

var cloneDeep = require("lodash.clonedeep");

export default function Curve({ name, value, onChange }) {
  let stateTemp = useRef();

  let canvasRef = useRef();

  let [toDisplay, setToDisplay] = useState([]);

  useAnimationFrame((deltaTime) => {
    setToDisplay(cloneDeep(stateTemp.current));

    let canvas = canvasRef.current;
    if (canvas) {
      let a = stateTemp.current.arr;

      let s = new Interp(a);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 100, 100);
      ctx.fillStyle = "#3dc9b0";
      ctx.fillRect(0, 0, 100, 100);
      ctx.beginPath();

      function get(i) {
        if (stateTemp.current.mode === "nearest") {
          return s.nearest(i);
        } else if (stateTemp.current.mode === "linear") {
          return s.linear(i);
        } else if (stateTemp.current.mode === "smooth") {
          return s.smoothstep(i);
        } else {
          return s.cubic(i);
        }
      }

      ctx.moveTo(0, 100 - get(0) * 100);
      for (let i2 = 0; i2 < a.length * 100 * 1.5; i2++) {
        let i = i2 / 100;
        ctx.lineTo((100 * i) / (a.length - 1), 100 - get(i) * 100);
      }
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.fillStyle = "#569cd6";
      ctx.lineWidth = 2;
      ctx.lineTo(100, 100);
      ctx.lineTo(0, 100);
      ctx.fill();
    }
  });

  useEffect(() => {}, [toDisplay]);

  let [drawing, setDrawing] = useState(false);

  useEffect(() => {
    window.addEventListener("mouseup", () => setDrawing(false));
  }, []);

  useEffect(() => (stateTemp.current = value), [value]);

  useEffect(() => {
    if (!drawing) {
      console.log("Curve: onChange ");
      onChange(stateTemp.current);
    }
  }, [drawing]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          textAlign: "left",
          color: "grey",
          fontSize: "0.7em",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ border: "1px solid rgba(0,0,0,0)" }}>{name}</div>

        <div
          style={{ border: "1px solid grey", cursor: "pointer" }}
          onClick={() => {
            stateTemp.current.mode =
              value.mode === "linear"
                ? "smooth"
                : value.mode === "smooth"
                ? "cubic"
                : value.mode === "cubic"
                ? "nearest"
                : "linear";
            onChange(stateTemp.current);
          }}
        >
          {value.mode}
        </div>
      </div>
      <canvas
        width={100}
        height={100}
        style={{ borderRadius: "5px", overflow: "hidden" }}
        onMouseMove={(e) => {
          if (drawing) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top; //y position within the element.
            stateTemp.current.arr[Math.floor(x / 10)] = (100 - y) / 100.0;
          }
        }}
        onMouseDown={(e) => {
          var rect = e.target.getBoundingClientRect();
          var x = e.clientX - rect.left; //x position within the element.
          var y = e.clientY - rect.top; //y position within the element.
          stateTemp.current.arr[Math.floor(x / 10)] = (100 - y) / 100.0;
          setDrawing(true);
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
