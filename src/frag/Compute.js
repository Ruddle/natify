import * as base64 from "byte-base64";
const pako = require("pako");

export function objToCompressedB64(obj) {
  const objJsonStr = JSON.stringify(obj);
  let objJsonB64 = base64.bytesToBase64(pako.deflate(objJsonStr));
  return objJsonB64;
}
export function compressedB64ToObj(b64) {
  return JSON.parse(pako.inflate(base64.base64ToBytes(b64), { to: "string" }));
}
