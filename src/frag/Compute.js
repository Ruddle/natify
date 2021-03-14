import * as base64 from "byte-base64";
import { WaveFile } from "wavefile";
import Interp from "./Interp";
const pako = require("pako");
const fft = require("jsfft");
var cloneDeep = require("lodash.clonedeep");

export function objToCompressedB64(obj) {
  const objJsonStr = JSON.stringify(obj);
  let objJsonB64 = base64.bytesToBase64(pako.deflate(objJsonStr));
  return objJsonB64;
}
export function compressedB64ToObj(b64) {
  return JSON.parse(pako.inflate(base64.base64ToBytes(b64), { to: "string" }));
}

function hashCode(s) {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}
function widgetsVal(widgets) {
  let paramsVal = {};
  Object.keys(widgets).forEach((key) => {
    if (widgets[key].type === "curve") {
      let interp = new Interp(widgets[key].value.arr);
      paramsVal[key] = {
        value: widgets[key].value,
        interp,
        get:
          widgets[key].value.mode === "nearest"
            ? (i) => interp.nearest(i)
            : widgets[key].value.mode === "linear"
            ? (i) => interp.linear(i)
            : widgets[key].value.mode === "smooth"
            ? (i) => interp.smoothstep(i)
            : (i) => interp.cubic(i),
      };
    } else {
      paramsVal[key] = widgets[key].value;
    }
  });
  return paramsVal;
}

function completeNewWidgets(userCodeWidgets, oldWidgets) {
  let usage = { DURATION: true };

  let newWidgets = cloneDeep(oldWidgets);

  if (!newWidgets.DURATION)
    newWidgets.DURATION = {
      min: 0.1,
      max: 10.0,
      step: 0.1,
      unit: "s",
      placeholder: 1,
      value: 1.0,
    };

  Object.keys(userCodeWidgets).forEach((widgetKey) => {
    usage[widgetKey] = true;
    let current = userCodeWidgets[widgetKey];
    let old = newWidgets[widgetKey];

    let isSlider = current.min !== undefined;
    let isGrid = current.width !== undefined;
    let isCurve = current.type === "curve";
    if (isSlider) {
      let {
        min,
        max,
        step,
        unit = "",
        placeholder = min > 0 ? Math.sqrt(min * max) : Math.sqrt(max),
      } = current;

      let clean = {
        min,
        max,
        step,
        unit,
        placeholder,
        value: placeholder,
      };
      if (!newWidgets[widgetKey]) {
        console.log("WIDGETS need to add  ", widgetKey);

        newWidgets[widgetKey] = clean;
      } else {
        let isEdited =
          min !== old.min ||
          max !== old.max ||
          step !== old.step ||
          unit !== old.unit;

        if (old.value != null && old.value <= max && old.value >= min) {
          clean.value = old.value;
        }

        if (isEdited) {
          console.log("WIDGETS need to edit ", widgetKey);

          newWidgets[widgetKey] = clean;
        }
      }
    } else if (isGrid) {
      let clean = { ...current };
      if (
        !clean.value ||
        clean.value.length != current.width ||
        clean.value[0].length != current.height
      ) {
        clean.value = [];
        for (let row = 0; row < clean.height; row++) {
          clean.value[row] = [];
          for (let col = 0; col < clean.width; col++) {
            clean.value[row][col] = false;
          }
        }
      }

      if (!old) {
        newWidgets[widgetKey] = clean;
      } else {
        if (old.width !== clean.width || old.height !== clean.height) {
          newWidgets[widgetKey] = clean;
        }
      }
    } else if (isCurve) {
      if (!old || old.type !== current.type) {
        let arr = [];
        for (let i = 0; i < 10; i++) {
          arr.push(0);
        }

        newWidgets[widgetKey] = {
          type: "curve",
          value: { arr, mode: "linear" },
        };
      }
    }
  });

  Object.keys(newWidgets).forEach((key) => {
    if (usage[key] !== true) {
      console.log("DELETING ", key);
      delete newWidgets[key];
    }
  });

  console.log("old ", oldWidgets);
  console.log("usr ", userCodeWidgets);
  console.log("new ", newWidgets);

  return newWidgets;
}

function compileJsSoundCode({ code, widgets }) {
  let oldWidgets = cloneDeep(widgets);
  try {
    let paramsArgs = Object.keys(widgets)
      .map((e) => e + ",")
      .join("");
    let code2 =
      "((SAMPLE_COUNT, RATE,CHANNEL, WIDGETS, {" +
      paramsArgs.slice(0, -1) +
      "}) => {" +
      code +
      "})";

    let f = eval(code2);
    console.log("IGNORE");
    let paramsVal = widgetsVal(widgets);
    widgets = {};
    let a = f(1, 44100, 0, widgets, paramsVal);
    console.log("END IGNORE");

    return {
      func: f,
      valid: true,
      widgets: completeNewWidgets(widgets, oldWidgets),
    };
  } catch (e) {
    console.error("CANT USE CODE ", e);
    return { func: () => 0.0, valid: false, oldWidgets };
  }
}

export function testSetting({ code, widgets }) {
  console.log("widgets test", widgets);
  let compiled = compileJsSoundCode({ code, widgets });
  return {
    valid: compiled.valid,
    widgets: compiled.widgets,
  };
}

export function computeSetting(setting, N, rate) {
  console.log("computeSetting ", setting);
  let compiled = compileJsSoundCode(cloneDeep(setting));
  let paramsVal = widgetsVal(setting.widgets);
  console.log("paramsVal", paramsVal);

  let res = [0];
  try {
    res = compiled.func(N, rate, 0, setting.widgets, paramsVal);
  } catch (e) {
    console.error("computeSetting catch ", e);
  }

  if (Array.isArray(res)) {
    res = { samples: res };
  }

  let start = performance.now();
  let loudness = [0];
  let blockSize = Math.floor(rate / 20);
  let blocks = Math.floor(N / blockSize);

  for (let i = 0; i < blocks; i++) {
    let f = new fft.ComplexArray(blockSize)
      .map((value, valueIndex, n) => {
        value.real = res.samples[i * blockSize + valueIndex];
      })
      .FFT();

    let m = f.magnitude().slice(0, blockSize / 2);

    let l = m.reduce((a, b) => a + b);
    // l = Math.pow(l, 0.5);
    loudness.push(l);
  }
  loudness.push(0);

  let max = loudness.reduce((a, b) => Math.max(a, b));
  loudness.forEach((e, i, a) => (a[i] = e / max));

  res.loudness = loudness;
  let end = performance.now();
  console.log("Loudness took : ", end - start, "ms");

  return res;
}

export function exportWav(rate, buffer) {
  let wav = new WaveFile();
  let bufferInt = buffer.map((v) => v * 32767);
  wav.fromScratch(1, rate, "16", bufferInt);
  let res = wav.toBase64();
  return "data:Audio/WAV;base64," + res;

  // var WAV = new Audio("data:Audio/WAV;base64," + res);
  // WAV.setAttribute("controls", "controls");
  // WAV.play();
}
