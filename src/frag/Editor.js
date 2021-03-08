import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";

import { createEvent } from "@testing-library/dom";
import RSlider from "./RSlider";
import ReactFlow, { Handle } from "react-flow-renderer";
import * as base64 from "byte-base64";
import Editor, { useMonaco } from "@monaco-editor/react";
// eslint-disable-next-line
import MyWorker from "comlink-loader!./Compute";
const pako = require("pako");
const qs = require("query-string");
var cloneDeep = require("lodash.clonedeep");

// instantiate a new Worker with our code in it:
const worker = new MyWorker();

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
let triangle=(freq,t) => Math.abs(((freq*t-0.25)%1.0)*2.0-1.0)*2.0-1.0
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
  let amplitude = Math.pow(0.5,i)
  s+= amplitude*shape
}
//Envelope
return s * atk(ATK,t) * dec(ATK,DESC,t)* VOLUME`;

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array} buffer
 */
function drawBuffer(canvas, buffer) {
  let ctx = canvas.getContext("2d");
  let h = canvas.height;
  let w = canvas.width;

  let min = buffer.reduce((prev, curr) => (curr < prev ? curr : prev));
  let max = buffer.reduce((prev, curr) => (curr > prev ? curr : prev));

  ctx.width = w;
  ctx.height = h;

  console.log(w);

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#977";
  ctx.lineWidth = "1";
  ctx.beginPath();
  ctx.moveTo(0, Math.floor(h / 2) + 0.5);
  ctx.lineTo(w, Math.floor(h / 2) + 0.5);

  let mol = Math.ceil((h * (-1 - min)) / (max - min)) + 0.5;
  ctx.moveTo(0, mol);
  ctx.lineTo(w, mol);

  let pol = Math.floor((h * (1 - min)) / (max - min)) - 0.5;
  ctx.moveTo(0, pol);
  ctx.lineTo(w, pol);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  for (var i = 0; i < buffer.length; i++) {
    let v = -buffer[i];
    ctx.lineTo((i / buffer.length) * w, ((v - min) / (max - min)) * h);
  }

  ctx.strokeStyle = "rgb(96, 197, 177)";
  ctx.lineWidth = "1";
  ctx.stroke();
}

function hashCode(s) {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

function generateJsSoundNode() {
  return {
    id: ID(),
    type: "JsSound",
    position: { x: 150, y: 20 },
    data: {
      sample: 44100,
      code: `let t = sample/rate;
    return Math.sin(440.*t* Math.PI*2)*0.4;`,
      cachedSample: null,
      params: [],
    },
  };
}

function generateSoundPlayerNode() {
  return {
    id: "SoundPlayerId",
    type: "SoundPlayer",
    data: {},
    position: { x: 250, y: 50 },
  };
}

function generateSampleGeneratorNode() {
  return {
    id: ID(),
    type: "SampleGenerator",
    data: {
      count: 44100,
    },
    position: { x: 0, y: 50 },
  };
}

const SampleGeneratorNodeStyles = {
  background: "#9CA8B3",
  color: "#FFF",
  padding: 10,
};
const SampleGeneratorNodeComponent = ({ data }) => {
  return (
    <div style={SampleGeneratorNodeStyles}>
      <Handle
        type="source"
        position="right"
        style={{ borderRadius: 0, backgroundColor: "white" }}
      />
      <div>Generator</div>
    </div>
  );
};

const SoundPlayerNodeStyles = {
  background: "#9CA8B3",
  color: "#FFF",
  padding: 10,
};
const SoundPlayerNodeComponent = ({ data }) => {
  return (
    <div style={SoundPlayerNodeStyles}>
      <Handle
        type="target"
        position="left"
        style={{ borderRadius: 0, backgroundColor: "blue" }}
      />
      <div>Speaker</div>
    </div>
  );
};

const JsSoundNodeStyles = {
  background: "#9CA8B3",
  color: "#FFF",
  padding: 10,
};
const JsSoundNodeComponent = ({ data }) => {
  return (
    <div style={JsSoundNodeStyles}>
      <Handle
        id="sample"
        type="target"
        position="left"
        style={{ borderRadius: 0, backgroundColor: "white" }}
      />
      <div>JsSound</div>
      <Handle
        id="sound"
        type="source"
        position="right"
        style={{ borderRadius: 0, backgroundColor: "blue" }}
      />
    </div>
  );
};

const nodeTypes = {
  SoundPlayer: SoundPlayerNodeComponent,
  JsSound: JsSoundNodeComponent,
  SampleGenerator: SampleGeneratorNodeComponent,
};

const defaultJsSound = generateJsSoundNode();
const defaultSoundPlayer = generateSoundPlayerNode();
const defaultSampleGenerator = generateSampleGeneratorNode();

function compileJsSoundCode(code, params) {
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
}

function computeJsSound(jsSound, sampleGenerator) {
  let buffer = new Array(sampleGenerator.data.count);
  for (let sample = 0; sample < buffer.length; sample++) {
    buffer[sample] = jsSound.compiled.func(sample, 44100, 0);
  }
  jsSound.data.buffer = buffer;
}

function compileElements(elements) {
  let edge = elements.find((e) => e.target === "SoundPlayerId");
  if (edge) {
    let source = elements.find((e) => e.id === edge.source);
    if (source && source.type === "JsSound") {
      let jsSound = source;
      let compiled = compileJsSoundCode(jsSound.data.code, jsSound.data.params);
      jsSound.data.compiled = compiled;
    } else {
      console.err("CANT COMPILE : UNIMPLEMENTED FOR ", source.type);
    }
  }
  return elements;
}

export default function EditorFrag() {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      console.log("here is the monaco isntance:", monaco);
      // monaco.editor.trigger("keyboard", "editor.action.fontZoomOut", {});
    }
  }, [monaco]);
  const [astate, setAstate] = useState();

  const [code, setCode] = useState(codeStr);

  // const [elements, setElements] = useState([
  //   defaultJsSound,
  //   // you can also pass a React component as a label
  //   defaultSoundPlayer,
  //   {
  //     id: "JsSound_SoundPlayer",
  //     source: defaultJsSound.id,
  //     target: defaultSoundPlayer.id,
  //     animated: true,
  //   },
  //   defaultSampleGenerator,
  //   {
  //     id: "JsSound_GE",
  //     source: defaultSampleGenerator.id,
  //     target: defaultJsSound.id,
  //     animated: true,
  //   },
  // ]);

  // let compile = useCallback(() => {
  //   setElements(compileElements(cloneDeep(elements)));
  // }, [elements]);

  const [params, setParams] = useState([]);

  useEffect(() => {
    async function getInitialData() {
      let data = getQueryStringValue("data");
      if (data) {
        let { code, params } = await worker.compressedB64ToObj(data);
        setCode(code);
        setParams(params);
      }
    }
    getInitialData();
  }, []);

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
    return compileJsSoundCode(code, params);
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
        1,
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
          } catch {
            return;
          }
        }
      }

      async function putInQuery(obj) {
        let str = await worker.objToCompressedB64(obj);
        setQueryStringValue("data", str);
      }
      putInQuery(
        cloneDeep({
          code,
          params,
        })
      );

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
        background: "rgb(62, 62, 62)",
        height: window.innerHeight,
        overflow: "hidden",
      }}
    >
      {/* <ReactFlow elements={elements} nodeTypes={nodeTypes} /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "rgb(62, 62, 62)",
          flex: "1 1 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 60 auto",
            margin: "10px",
            padding: "10px",
            background: "rgb(30 30 30)",
            borderRadius: "3px",
          }}
        >
          <button
            style={{
              padding: "10px",
              backgroundColor: "#099",
              border: "none",
              borderRadius: "3px",
            }}
            onClick={() => {
              compute();
            }}
          >
            Start
          </button>
          <div style={{ fontSize: "0.8em", marginTop: "10px", color: "white" }}>
            <div> Write your sound function on the right !</div>
            <div>
              The function will be evaluated for every sample (usually 44100 per
              second of playback) and played.
            </div>
            <div>
              Sliders are auto-generated by comments starting with //use.
            </div>
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
            margin: "10px",
            padding: "0px",
            background: "rgb(30 30 30)",
            minWidth: "877px",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <Editor
            height="60vh"
            defaultLanguage="javascript"
            defaultValue={code}
            onChange={(v, e) => setCode(v)}
            theme="vs-dark"
            options={{
              fontSize: "12",
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "10px",
          flex: "1 1 auto",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 20 + ""}
          height="300"
          style={{ width: window.innerWidth - 20 + "px", minHeight: "50px" }}
        ></canvas>
      </div>
    </div>
  );
}
