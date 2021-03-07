import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";

function polarToCartesian(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

const WIDTH = 120;
const WIDTH_HALF = WIDTH / 2.0;

function SvgComponent({ angle }) {
  let state = useMemo(() => {
    let a2 = angle + Math.PI / 2.0;
    let arcpaths = [describeArc(90, 90, 70, Math.PI / 2.0, a2)];
    if (a2 >= Math.PI * 2.5) {
      arcpaths = [
        describeArc(90, 90, 70, Math.PI / 2.0, Math.PI * 1.99 + Math.PI / 2.0),
        describeArc(90, 90, 70, Math.PI / 2.0, a2 % (Math.PI * 2)),
      ];
    }

    let cx = 90 + 70 * Math.cos(a2);
    let cy = 90 + 70 * Math.sin(a2);

    return {
      arcpaths,
      cx,
      cy,
    };
  }, [angle]);

  return (
    <svg
      width={WIDTH}
      height={WIDTH}
      viewBox="0 0 180 180"
      style={{
        padding: 5,
        boxSizing: "border-box",
      }}
    >
      <circle
        r={70}
        cx={90}
        cy={90}
        strokeWidth={5}
        stroke="#e9eaee"
        fill="none"
      />

      {state.arcpaths.map((d, index) => (
        <path
          d={d}
          strokeLinecap="round"
          strokeWidth={20}
          stroke={index === 0 ? "#007aff" : "#000000"}
          fill="none"
        />
      ))}

      <circle r={20} cx={state.cx} cy={state.cy} fill="#fff" cursor="pointer" />
    </svg>
  );
}

function format(step, value) {
  if (Math.round(step) !== step) {
    return Math.round(value * (1.0 / step)) / (1.0 / step) + "";
  } else {
    return Math.round(value) + "";
  }
}

export default function RSlider({
  min,
  max,
  step,
  value,
  onChange,
  maxTurn,
  name,
}) {
  let angle = useMemo(() => (Math.PI * 2 * (value - min)) / (max - min));

  let ref = useRef();

  let mousemove = useCallback(
    (event) => {
      const rectSize = ref.current.getBoundingClientRect();
      const width = rectSize.width;
      let center = width / 2;
      let relativeX = event.clientX - rectSize.left;
      let relativeY = event.clientY - rectSize.top;
      let angleBetweenTwoVectors = Math.atan2(
        relativeY - center,
        relativeX - center
      );

      angleBetweenTwoVectors =
        (angleBetweenTwoVectors + Math.PI * 2 - Math.PI / 2) % (Math.PI * 2);
      angleBetweenTwoVectors /= Math.PI * 2;

      if (!isNaN(angleBetweenTwoVectors)) {
        let newValue = min + (max - min) * angleBetweenTwoVectors;
        newValue = Math.max(
          min,
          Math.min(max, Math.round(newValue / step) * step)
        );
        onChange(newValue);
      }
    },
    [onChange, min, max, step]
  );

  let [clicked, setClicked] = useState(false);

  useEffect(() => {
    window.addEventListener("mouseup", () => setClicked(false));
  }, []);

  useEffect(() => {
    if (clicked) {
      window.addEventListener("mousemove", mousemove);
      return () => window.removeEventListener("mousemove", mousemove);
    }
  }, [clicked, mousemove]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: WIDTH + "px",
          height: WIDTH + "px",
          position: "relative",
        }}
        onMouseDown={(e) => {
          setClicked(true);
          mousemove(e);
        }}
      >
        <SvgComponent angle={angle}></SvgComponent>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div style={{ fontSize: "0.8em", fontWeight: "bold", color: "grey" }}>
            {name}
          </div>
          <div style={{ color: "#007aff" }}>{format(step, value)}</div>
        </div>
      </div>

      {/* <input
        type="range"
        min={min + ""}
        max={max + ""}
        step={step + ""}
        value={value + ""}
        // onChange={(e) => onChange(e.target.value)}
      ></input> */}
    </div>
  );
}
