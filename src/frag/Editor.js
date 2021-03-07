import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { createEvent } from "@testing-library/dom";
import RSlider from "./RSlider";

const codeStr = `//Globals are : sample (0,1,2..), rate (44100hz..), channel (0,1..)

//use VOLUME   0.00 to 1.0  by 0.1;
//use ATK      0.01 to 0.05 by 0.001;
//use DESC     0.1  to 2.   by 0.01;
//use FREQ     50   to 1800 by 10;
//use HARMONIC 1.   to 7.   by 1.;
//use INC      0.0  to 4.0  by 0.1;

//Math Helper functions
let clamp = (x, a, b) => Math.max(a, Math.min(b,x))
let flatstep = (a,b,x) => clamp((x-a)/(b-a),0,1)
let ease = (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t
let smoothstep = (a,b,x) => ease(flatstep(a,b,x))
let mix=(a,b,m) => a*(1.0-m)+b*m;
//Sound Synthesis functions
let pure=(freq,t) => Math.sin(freq*t* 2* Math.PI)
let triangle=(freq,t) => Math.abs(((freq*t-0.25) %1.0 )*2.0-1.0)*2.0-1.0
let square=(freq,t) => triangle(freq,t)>0.0 ? 1.0 : -1.0
let saw   =(freq,t) => (freq*t %1.0)*2. -1.
let atk=(d,t) => smoothstep(0,d,t)
let dec=(a,b,t) => Math.exp(-3*Math.max(0,t-a)/(b-a))

//time in seconds
let t = sample / rate;
let s = 0.0;
//0 is fundamental, others are harmonics
for(var i = 0; i<HARMONIC;i++){
  let freq = FREQ * Math.pow(INC,i)
  let shape = pure(freq,t)
  let intensity = Math.pow(0.5,i)
  s+= intensity*shape
}
//Envelope
s *= atk(ATK,t)*dec(ATK,DESC,t)
return s*VOLUME;`;

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawBuffer(canvas, buffer) {
  let ctx = canvas.getContext("2d");
  let h = canvas.height;
  let w = canvas.width;

  ctx.width = w;
  ctx.height = h;

  console.log(w);

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "#456";
  ctx.fillRect(0, 0, w, h);

  ctx.beginPath();
  ctx.moveTo(0, Math.floor(h / 2) + 0.5);
  ctx.lineTo(w, Math.floor(h / 2) + 0.5);
  ctx.strokeStyle = "#999";
  ctx.lineWidth = "1";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  for (var i = 0; i < buffer.length; i++) {
    let v = -buffer[i];
    ctx.lineTo((i / buffer.length) * w, (v * 0.5 + 0.5) * h);
  }

  ctx.strokeStyle = "#000";
  ctx.lineWidth = "1";
  ctx.stroke();
}

function hashCode(s) {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export default function EditorFrag() {
  const [astate, setAstate] = useState();

  const [code, setCode] = useState(codeStr);

  const [params, setParams] = useState([
    {
      name: "P_0",
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
  ]);

  const canvasRef = useRef();

  useEffect(() => {
    let res = [
      ...code.matchAll(
        "//use ([a-zA-Z0-9_]+) +([0-9.]+) +to +([0-9.]+) +by +([0-9.]*)+ *; *\n"
      ),
    ];

    let usage = {};

    let newParams = params.slice();
    let changeParams = false;
    params.forEach((e) => {
      usage[e.name] = 0;
    });

    for (var i = 0; i < res?.length || 0; i++) {
      let name = res[i][1];
      let min = 0;
      let max = 1;
      let step = 0.01;

      min = parseFloat(res[i][2]);
      max = parseFloat(res[i][3]);
      step = parseFloat(res[i][4]);

      let index = params.findIndex((e) => e.name === name);
      if (index === -1) {
        changeParams = true;
        newParams.push({
          name,
          min,
          max,
          step,
          value: min > 0 ? Math.sqrt(max * min) : max / 2,
        });
      } else {
        let current = params[index];
        if (
          current.min !== min ||
          current.max !== max ||
          current.step !== step
        ) {
          changeParams = true;
          current.min = min;
          current.max = max;
          current.step = step;
          current.value = min > 0 ? Math.sqrt(max * min) : max / 2;
        }
      }

      usage[name] = (usage[name] || 0) + 1;
    }

    params.forEach((e) => {
      if (usage[e.name] === 0) {
        changeParams = true;
        newParams = newParams.filter((e2) => e2.name !== e.name);
      }
    });

    if (changeParams === true) setParams(newParams);
  }, [code, params]);

  const codeCompiled = useMemo(() => {
    let hash = hashCode(code + params.map((e) => e.value + "").join(";"));
    try {
      let paramsArgs = params.map((e) => e.name + ",").join("");
      let code2 =
        "((sample, rate,channel, {" +
        paramsArgs.slice(0, -1) +
        "}) => {" +
        code +
        "})";

      let f = eval(code2);
      let a = f(10, 44100, 1, {});
      return { func: f, valid: true, hash };
    } catch (e) {
      console.error("CANT USE CODE ", e);
      return { func: () => 0.0, valid: false, hash };
    }
  }, [code, params]);

  let compute = useCallback(() => {
    if (astate && astate.audioCtx && codeCompiled.valid === true) {
      if (astate.gainNode) {
        // astate.source.stop();
        let duration = 0.05;
        let N = (astate.audioCtx.sampleRate * duration) / 10.0;
        var waveArray = new Float32Array(N);
        for (var i = 0; i < N; i++) {
          waveArray[i] = Math.pow(1.0 - i / (N - 1), 2);
        }
        astate.gainNode.gain.setValueCurveAtTime(
          waveArray,
          astate.audioCtx.currentTime,
          0.05
        );
      }
      var myArrayBuffer = astate.audioCtx.createBuffer(
        2,
        astate.audioCtx.sampleRate * 1,
        astate.audioCtx.sampleRate
      );
      for (
        var channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);

        let paramsVal = {};
        params.forEach((e) => (paramsVal[e.name] = e.value));
        for (var i = 0; i < myArrayBuffer.length; i++) {
          try {
            nowBuffering[i] = codeCompiled.func(
              i,
              astate.audioCtx.sampleRate,
              channel,
              paramsVal
            );
          } catch {}
        }
      }

      let source = astate.audioCtx.createBufferSource();
      source.buffer = myArrayBuffer;

      var gainNode = astate.audioCtx.createGain();
      gainNode.gain.value = 1.0;
      source.connect(gainNode);
      gainNode.connect(astate.audioCtx.destination);

      //   source.connect(astate.audioCtx.destination);
      source.start();

      drawBuffer(canvasRef.current, myArrayBuffer.getChannelData(0));

      setAstate((old) => {
        return { ...old, source, gainNode, hash: codeCompiled?.hash };
      });
    }
  }, [astate, codeCompiled]);

  useEffect(() => {
    if (codeCompiled.valid === true && astate?.hash !== codeCompiled?.hash) {
      compute();
    }
  }, [codeCompiled, compute, astate, params]);

  useEffect(() => {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    setAstate({ audioCtx });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#789",
        height: window.innerHeight,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "#789",
          flex: "1 1 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 60 auto",
            margin: "20px",
            padding: "20px",
            background: "#EFF",
          }}
        >
          <button
            onClick={() => {
              compute();
            }}
          >
            Start
          </button>
          <div style={{ fontSize: "0.8em", marginTop: "10px" }}>
            Write your sound function on the right ! Sliders are auto-generated
            by comments starting with //use.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flex: "1 1 auto",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            {params.map((p) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RSlider
                  name={p.name}
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={p.value}
                  onChange={(v) =>
                    setParams((old) => {
                      let arr = old.slice();
                      let elem = arr.find((e) => e.name === p.name);
                      if (elem) elem.value = v;
                      return arr;
                    })
                  }
                ></RSlider>
              </div>
            ))}
          </div>

          <div style={{ flex: "5 1 auto" }}></div>
        </div>
        <div
          style={{
            flex: "1 1 auto",
            margin: "20px",
            padding: "20px",
            background: "#EFF",
            maxWidth: "890px",
          }}
        >
          <Editor
            value={code}
            onValueChange={(c) => setCode(c)}
            highlight={(c) => highlight(c, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "20px", flex: "none" }}>
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 40 + ""}
          height="300"
          style={{ width: window.innerWidth - 40 + "px", height: "300px" }}
        ></canvas>
      </div>
    </div>
  );
}
