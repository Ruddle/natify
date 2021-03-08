import * as base64 from "byte-base64";
const pako = require("pako");
const fft = require("jsfft");
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
function compileJsSoundCode({ code, params }) {
  let hash = hashCode(code + params.map((e) => e.value + "").join(";"));
  try {
    let paramsArgs = params.map((e) => e.name + ",").join("");
    let code2 =
      "((SAMPLE_COUNT, RATE,CHANNEL, {" +
      paramsArgs.slice(0, -1) +
      "}) => {" +
      code +
      "})";

    let f = eval(code2);
    let a = f([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 44100, 1, {});
    return { func: f, valid: true, hash };
  } catch (e) {
    console.error("CANT USE CODE ", e);
    return { func: () => 0.0, valid: false, hash };
  }
}

export function testSetting({ code, params }) {
  let compiled = compileJsSoundCode({ code, params });
  return { valid: compiled.valid, hash: compiled.hash };
}

export function computeSetting({ code, params }, N, rate) {
  let compiled = compileJsSoundCode({ code, params });
  let paramsVal = {};
  params.forEach((e) => (paramsVal[e.name] = e.value));
  return compiled.func(N, rate, 0, paramsVal);
}
