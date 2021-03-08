import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";

import { createEvent } from "@testing-library/dom";
import RSlider from "./RSlider";
import ReactFlow, { Handle } from "react-flow-renderer";
import * as base64 from "byte-base64";
import Editor, { useMonaco } from "@monaco-editor/react";
// eslint-disable-next-line
import MyWorker from "comlink-loader!./Compute";
import Grid from "./Grid";
const fft = require("jsfft");
const pako = require("pako");
const qs = require("query-string");
var cloneDeep = require("lodash.clonedeep");

// instantiate a new Worker with our code in it:
const worker = new MyWorker();

const tuto1 =
  "?data=eJxtkm9v2jAQxr%2FKya8KzRJnK5qUri%2FQykaltWX982IiaDLJAV4dG8U2FBDffWdCqKrtVc7ne36%2B5y47VpgSWcaSJLmWc%2BmEAmu8LkFa%2BOOtAwEWHZgZWFEtFdoY%2BscQalzWaFE7e9SEo%2FU1ggi6uVyhBicrjHNN%2FCHSzcZ4KISGEmdS4z90cAvSrqVSMEVYKrHBEqaieAFngjbXBxR8V2YqlAVByAyunx%2F6Tzf3dxHQdwBnFxcp54ttHHcieOzfjn4Mfn%2B9f757atW%2F3jdRkE9TgVWyxBqmG%2FBW6jkUpqoO5pR8QWqMJmKoOgsMbxG%2BPQx%2BQo%2BHzug5HoQpDLeX4RVFrlpLVzCe5Hpmajh7S1OWX7bxl3ddtunz8w7scg2QJGGIIDUNqzC6tCEZUIf01bE8Cd6b8scGW4X90Rin6NZIq%2FiQgqAtpaHo2Ny4%2BU6IcivcIibjZwdf3QbebdKjG%2Bh%2BjHmnwY%2F8yUWhjKWZ0QgOc1BmHU4LhJVRvsL%2FvNQl4%2FHnXO9zXaPztW4LWMSWohaVZdl4x7Sowm%2FZbpYuK6lZxuMeReKVZSmPmHW4DLk0YiuhPAko8lo6Ulq2j06YYKlF9PiJwE%2BMN91wy060T5zvJ%2Fu%2FqeoC8g%3D%3D";

const tuto2 =
  "?data=eJydk1tv2jAUgP%2FKkZ9yI3EYaFJaNkU0E2gt7bg8TARVhpoRLXEQcVpWxH%2Bf7VzItGyd9gCxzznflxPn5IQ26RNFHnIcZ8f5PvMchzL7Jfoe7elTROz08M2ROydgzzRO9%2FRRS%2FIs2ughC5nj5BmFT9PgC%2FQx8BRcjDGsf4ALo9erKu%2FP5%2F7wM2Abu7IG264sUdusLroJhv7XN2pmi9ncH0%2FqqraaaXAb%2BLOgYer%2BUiXr7gjfwYjGe3qAbc42PEpZFrKYctjEJNnDALSjBcSCtQ6DDyDr7YQcNREp1hHT1hYcdb2gtjHhGacKlJRMSVDZNO0IHSA6OKCt1coCbIFbspSIrgXHFcHhGuw%2BfIQuGGIjfx50XDBB6wlWRXX5V8BZkqZ813ZrqdWqvuqMemsKFI3FNBPUchWybXoA7RIWUXxVra9h5t893AaPw%2FvFZF6FTVOHU8gAJMWjRDJFxpn680Bmylssi%2BtKFKizy8TZqYkxCs4owg9jMLo2Vg0COPW4QZvKGDSeXMNWMWGWEup%2FAFwbd8QwGA2wxIqLqSbw747f2AIyy8E0y%2BGzoC1bq1vkwo3t9yE7h%2BxAeX5gVQGy0J4cSJIhb3lCjCTyW71ZiDMe309EUkwi8rDdFytyRJ6LLSTbkzHXQs8kzgUgVjmLuCAzdLZqjXwLlaKPawOuHRdu9IpqW6%2BHG5LiSS%2BdYLcUqQaqXnCzhdok4u8aKnVa%2F23qNUzlibe4%2FsHUFJUvtLWp7tsq1z2vzj8BM4CUgw%3D%3D";

const tuto3 =
  "?data=eJx9Vf1v2kgQ%2FVdGlk5aF2PWBkohTStEiRq1SXr5uF8SVC2wYOuM7drrhDTif7%2BZXX%2BFy12kYO%2Fsmzdv386uX6xVspbWxOr1ilzCX1ff7y7mAMBdzkEl4LkcYPmMY%2B%2FkITag6e030H8I8giEz6EBcQzkNfDL%2FGZWAj0goO9CyfYKd3Y9%2F1PjhlhMV%2F2A1RHncQh%2B17Cv0%2BuLq8vzGYoysFFJ57k15vxyVmvTmMGrBRDsQqgAvsoolRlsinilwiTOH%2BJIKlhFYpfCKbC9A8KBpQ2nn4Dw7k7sGUbMexizpQN72zZZm0ioXEmdSFk0RYmajbE9dEHY0AO21G8OcAe8MlcKFI15Smco%2BAjuED6DD%2B9wQP8T6HrQATbAXB216cck57skUcFbpYmWVbrqmbLmLtw3%2BJ3GCyRltNddCnRgieOdNvUmKeI13DzHKpB5mB87lhaZ1r%2FJ5C8HVGNYjiZRsFwISdfxH%2BelCpWFIt5Gb2eLZc5Yk9%2FF7fOHNvxB%2FUgG%2BFrq8aB05Vch%2Fi2qKtcEP%2Bke%2BaxbnFyu88XTcXKjpKVA1zQpQv1NKesK32wMw73WYQNcy1VjfWu9cp%2Bybr%2FyiJoN89RR45QcT0GoZJyEpnEajkzE62THjhypdjDNkpXMcVe2x1uYyUeZLYlrWWw2MnMgEltNa8buJsnmYhUwJh0IHZKEcyH6hzj0T9yHC%2Bic0hOLYmyBCrg7QFN5KTkPd2kkz85umyqa5OUhBqyviiyGWD7BZqPcWULY%2FTTLxHOJdSMZb1VgozF4nh5FVBglcUMCoMNuJkWERUweCjuhyYPtYm2GYg7VFlONHIGmzM304sf3%2Bc%2FZ1d3lLaJwwcAqHIL4iXn7CG2gCXY6tlGgexrBGtmD6%2Bnt%2FKSKUyVsNj3W5I8iQwc1c4i01c2Go5rPZOrGOzU3ZNkdafLE8JpDB%2BwGlwcipX6g81i3bjNN6w1VsSZITcLdYUOS6y2sYe8Mo3aPfkrH7um5oF3MEYJtz%2FBj4JhLCXvbjOjaL2Pme2KM7%2FVMp7GSy6FDzRFEVlVX6Ub9JA%2BrfqmwtPXbWEtjtptH4UrSCWlvB3ruI0vZTS8t0Q69bzORBvkE7qsglVqgMMuxUpGJXW5N7l%2BsWOzoa%2FjlDkWdX13iJN721oSssvBYWhOPOxYdbIp5jqW7DqOOVaA8zMytg1PTmOXXJBXFK4Yyz6q5sFaLAh1tRHCvpKAvbsPCebt%2Bi4j7fv89fz8aj0aD8Xj0YTxqMdM2NdQVs9%2Bi%2FQ%2FWwWDke%2F3heIic4%2BFo3OKkPq04h%2FV68WtesZJ9JWfwuyHtc95iqY5DxVRpG9Usb9jWbxHg8Tg2ffD%2FpvuHxeEf4%2FOUOQ%3D%3D";

const tuto4 =
  "?data=eJx9VWlP20AQ%2FSsjS5XWxDFrE2MSLkU0FVG5ytEvgKpNYojV%2BMBeQwDlv3dm1xcpbSTw7ux7b2bfjtfvxjSZBcbA2Nws8gB%2Bnp%2FcnI4AgNucg0zAsTnA5BXnzu5drEHD6%2B%2BgfghyCIRPT4M4BvIa%2BHV0dVQCHSCga0Op9gH37XL0Q%2BE8TKay7mB2xDkc5m817Hh4eXp%2BNj7CojTML%2BUcu8aMz47q2hSm92EDBDsVcg7HwSINMngo4qkMkzi%2FixeBhOlCRCnsA1taICyYmLB%2FAIS3I7FkGNHjMGYTC5amqVkPCyFzGSgisWiJiEqNsSV0QZiwCWyiRhZwC5ySGwgsGnlSMSTsge3BIbiwgRP6G0DXgQ6wHnJV1KR%2FmpxHSSLnn6UmWVbVVa%2BUOaNw2eAjhRcoyuisuxTowATnkTL1KiniGVy9xnIe5GG%2B7lhaZKr%2Bhyx4skA2huVoEgXLjVDpKn4xLquQWSjix8XnbDHJGWv4XTw%2B1zPhC%2FUjGeCqUtcnpStPhfi7qCpdEzxQPXKoWpxcrvniZZ3cVNKqQOXUFCF%2FE2VW4ZuDYXjWKqyBs2DaWN%2Fab7BMWXer8oiaDXlyrXFKjUy8xIlUG6RnI5ImL8y1LR1GRt8msuOa1Pd6Z1G6CHJkDrNMvLKr4enFyejX0fnN2TWCHpIMWIVDEN%2FVoz1oA3Ww0zHh%2FS4GUEeJYIXchMvh9Wi3ilMm9LieZ2qupre4P1e9CT39Prj3NuYfiemcsVjtSckDqKqeRQahLinEeqqbAGd1IfRTbyMd1X7lEmlt6Atmo3EJbwkLQrNNy%2BciJU%2BpoeuzbwPIu1AWMwLVQtz22kIZdPZbwA2tqldX%2BpETJMMl7BmGN6ml32hsDD2jO7NJjS1AljmenioDabhS6%2BV53tLznvohRyV9heM6JswCWWSx9qcEWzR%2BzEQ6zwdwWwbvEW1YRioyEeXG4PbdiEVEX4WvN3ig4%2FMzXMRbzxjQfg1sT2PgcMugBqeYYxnPYlEgwaH1Ig4lcnNjZdVCuqpaphL5oFHyjFoNs7Uk0J6mDO6UEvTtaVQ4d1r5W0Lcdbe2%2Bbbf9%2F1ev%2B%2Fv9P2WMnneSFfKbkv2H6q9nu86W17fQ82%2B5%2FdbmtRylaZX7xe%2Fa5UqGVhqzt8a0S3OWypVo1dKVW1%2BrfKJbW3TsNPXTe%2F933R3db%2F6A6uoOxk%3D";
const tuto5 =
  "?data=eJydVm1v2kgQ%2FisjS1eZYIxNQtOS0ipKuSu6BtKQ3BeCTgsssXV%2Bq70u0Ij%2FfjO7XttQiE5nKcY7%2BzzPzs7Lbl6MRbzkRs9ot%2FOMw1%2Fjr4%2B3AwBwbMcBEYNrOwDzLY7dq6dIga4f%2FgT5IMglEP52FchBQ1YCPw8mNwXQBQJ2bCjU9nC%2F3w%2B%2BSVwXF5OrvsPVEec64P0sYV%2Bu72%2FHo%2BENOqVgl4Wca5eY4eim9E1iLo5sYHJ3fTMoQF1QOzgvHdOwP1J%2FCaPxw2BCfrxFM03cMuHBFx4kPIVVHi2EH0fZUxRwAYuAhQn0wdxYwCyYN6D%2FEQhvh2xjokV9%2B5E5t2DTaCjWKmAiE1wSiUVTRJRqprmBFrAGtMGcyy8LHAvcgssZ7gZ5QjIEfAC7C5%2BgA2c4oL8etFxognmBXGlt0EuRszCOhXdsaZI1tV%2FlTLFm6G8qfCjxDEVNqpQWGZowx3EowziJ82gJk20kPJ752WHEkjyV%2Fq9S%2Ft0CUQUswyCRsdgIuS7td8PCC5H6LHoOjrPZPDPNit%2FCtHa6DfiNqpkC0JGuHg6KqHzP2a9O6eUq40dZYZ9kg1CUSz5bH5IrT2oeyDUVhYl%2FiLLU%2BCoxJuZamhVwyRdV6Gv75ZvEbHV1jKjYkCcOCqfQSNk6ioXcIP1WIkm8Nju2pczIeG8T2e00qO7VzsIk4BkypzNleU5Z4qnhKk7B1CiEOFfq6wNMrm%2Fvvg7%2Bvhk%2Fjh6UsdlswMtTBCATiWCJbMP99cPgSttpHYxwOU7luJr2wzwQLOJxLpFkl71qoycDtvBMM43XFuBrGC25qmu5qOInvlh4SFScgEfP2NatEq6AOKrkFnFgAb5%2BkVOC8WqVcdqMhmA65DmjQXqjbdomLqUIV3q63R5HwRbZYZJj%2FDPZOMJjuFXBUsGXwNDgsQwwP7Clg8OP%2FMzjS63gr4CchDdvQGB1yl%2BMPx3CGG%2FQMHrq0Wv23WpKpvEHS8FXOfRRQB%2B7OCozpx95gFF193VhmTKyVOPyVD%2BriguPZgv8xiE981hC5UhnQdk2hyAqPV%2FkSwKWgo7dPRRModmvgc%2BUeoXYVZ8ZQVOEYPuZeKVZ6nDEHlMjitu%2BK6kutJrSTs6rt2yHKeV41t8LMU0W3aOmqRRwreK2fYpQLOUiTyMV3QJrlaJZD6baKA3YcTvDMhKWsjAzetMXI2IhXeOfH7G8huMRTuJFY%2FQoRgaeCEbPdSyDzhSyuZbxgwU5Elz70tl7OpaRR75AqczYWaWucrVU1Zp7kgXPKMXxVt0Xdy5qkhjlykvHLSTpSq5UHcet%2BVMTdtwDabemTKmrpLVypyZ7QtV9X1Oh%2BtUq3XLH%2BJ%2BJ1qGIFirez0qme%2BnUVHT3aCXtzWWpciRwnZoAts1h2C9eD3udLc83nFr7S%2BEplz3uP3vIeGsZYpsQ6Bn%2F06no0%2BmKBRm3Tr1Fmp8yz6yT3BrruMBR7itrvcI9wToOKbn%2FgXXM6f9DU8Ga1fIkr4paO3TLdjg%2FWrZ7VXu%2Bm%2B3%2BBWEwbUk%3D";
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array} buffer
 */
function drawBuffer(canvas, buffers) {
  let ctx = canvas.getContext("2d");

  for (let bufferIndex = 0; bufferIndex < buffers.length; bufferIndex++) {
    let buffer = buffers[bufferIndex];
    let h = canvas.height;
    let w = canvas.width / buffers.length;

    if (
      buffer === undefined ||
      (!Array.isArray(buffer) && buffer.constructor !== Float32Array) ||
      buffer.length < 2
    )
      continue;

    ctx.resetTransform();
    ctx.translate(bufferIndex * w, 0.0);

    let min = buffer.reduce((prev, curr) => (curr < prev ? curr : prev));
    let max = buffer.reduce((prev, curr) => (curr > prev ? curr : prev));

    console.log("min max ", min, max);

    ctx.width = w;
    ctx.height = h;

    console.log(w);

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgb(30,70,70)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgb(30,30,30)";
    ctx.fillRect(1, 1, w - 1, h - 1);

    function vToH(v) {
      return h - ((v - min) / (max - min)) * h;
    }
    ctx.strokeStyle = "#977";
    ctx.lineWidth = "1";
    ctx.beginPath();
    ctx.moveTo(0, vToH(0));
    ctx.lineTo(w, vToH(0));

    let mol = Math.ceil(vToH(-1)) + 0.5;
    ctx.moveTo(0, mol);
    ctx.lineTo(w, mol);

    let pol = Math.floor(vToH(1)) - 0.5;
    ctx.moveTo(0, pol);
    ctx.lineTo(w, pol);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, vToH(buffer[0]));
    for (var i = 0; i < buffer.length; i++) {
      let v = buffer[i];
      ctx.lineTo((i / (buffer.length - 1)) * w, vToH(v));
    }

    ctx.strokeStyle =
      bufferIndex % 2 === 0 ? "rgb(96, 197, 177)" : "rgb(100, 153, 211)";
    ctx.lineWidth = "1";
    ctx.stroke();
  }
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

function compileJsSoundCode(code, params) {
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

export default function EditorFrag() {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      console.log("here is the monaco isntance:", monaco);
      // monaco.editor.trigger("keyboard", "editor.action.fontZoomOut", {});
    }
  }, [monaco]);

  useEffect(() => {
    async function doo() {
      let buffer = await worker.computeBuffer("() => [1, 2, 3, 4, 5, 6]", {});
      console.log("BUFFER ", buffer);
    }
    doo();
  }, []);

  const [astate, setAstate] = useState();

  const [setting, setSetting] = useState({
    code: "return Array.from(Array(SAMPLE_COUNT).keys()).map(e => 0.0)",
    params: [],
  });

  const code = setting.code;
  const params = setting.params;

  function setCode(c) {
    setSetting((old) => {
      return { ...old, code: c };
    });
  }
  function setParams(newParams) {
    setSetting((old) => {
      return { ...old, params: newParams };
    });
  }

  // const [code, setCode] = useState("return []");
  // const [params, setParams] = useState([]);

  useEffect(() => {
    async function getInitialData() {
      let data = getQueryStringValue("data");
      if (data) {
        let { code, params } = await worker.compressedB64ToObj(data);
        setSetting({ code, params });
      } else {
        loadPreset(tuto3);
      }
    }
    getInitialData();
  }, []);

  function loadPreset(preset) {
    async function getData(preset) {
      let data = getQueryStringValue("data", preset);
      if (data) {
        let { code, params } = await worker.compressedB64ToObj(data);

        setSetting({ code, params });
      }
    }
    getData(preset);
  }

  const canvasRef = useRef();

  useEffect(() => {
    let matchesForSlider = [
      ...setting.code.matchAll(
        "//use ([a-zA-Z0-9_]+) +([0-9.]+) +to +([0-9.]+) +by +([0-9.]*)+ *([a-zA-Z/0-9]*) *; *\n"
      ),
    ];

    let usage = {};

    let newParams = setting.params.slice();
    let changeParams = false;
    if (newParams.findIndex((e) => e.name === "DURATION") === -1) {
      changeParams = true;
      newParams.push({
        name: "DURATION",
        min: 0.5,
        max: 10.0,
        step: 0.1,
        value: 1.0,
        unit: "s",
      });
    }

    newParams.forEach((e) => {
      usage[e.name] = 0;
    });

    usage["DURATION"] = 1;

    for (var i = 0; i < matchesForSlider?.length || 0; i++) {
      let name = matchesForSlider[i][1];
      let min = 0;
      let max = 1;
      let step = 0.01;

      min = parseFloat(matchesForSlider[i][2]);
      max = parseFloat(matchesForSlider[i][3]);
      step = parseFloat(matchesForSlider[i][4]);
      let unit = matchesForSlider[i][5] || "";

      let index = newParams.findIndex((e) => e.name === name);
      if (index === -1) {
        changeParams = true;
        newParams.push({
          name,
          min,
          max,
          step,
          unit,
          value: min > 0 ? Math.sqrt(max * min) : max / 2,
        });
      } else {
        let current = newParams[index];
        if (
          current.min !== min ||
          current.max !== max ||
          current.step !== step ||
          current.unit != unit
        ) {
          changeParams = true;
          current.min = min;
          current.max = max;
          current.step = step;
          current.unit = unit;
          current.value =
            current.value >= min && current.value <= max
              ? current.value
              : min > 0
              ? Math.sqrt(max * min)
              : max / 2;
        }
      }

      usage[name] = (usage[name] || 0) + 1;
    }

    //GRID
    let matchesForGRID = [
      ...setting.code.matchAll(
        "//useGrid ([a-zA-Z0-9_]+) +([0-9]+) +([0-9]+) *; *\n"
      ),
    ];

    for (var i = 0; i < matchesForGRID?.length || 0; i++) {
      let name = matchesForGRID[i][1];

      console.log("matchesForGRID[i] ,", matchesForGRID[i]);
      usage[name] = (usage[name] || 0) + 1;
      let width = parseInt(matchesForGRID[i][2]);
      let height = parseInt(matchesForGRID[i][3]);

      let index = newParams.findIndex((e) => e.name === name);

      if (index === -1) {
        console.log("NOT FOUND");
        changeParams = true;

        let valueGrid = [];
        for (let row = 0; row < height; row++) {
          valueGrid[row] = [];
          for (let col = 0; col < width; col++) {
            valueGrid[row][col] = false;
          }
        }

        newParams.push({
          name,
          width,
          height,
          type: "grid",
          value: valueGrid,
        });
      } else {
        console.log(" FOUND");
        let current = newParams[index];
        console.log(current);
        if (
          current.width !== width ||
          current.height !== height ||
          current.type !== "grid"
        ) {
          console.log(" TO BE REPLACED");
          let valueGrid = [];
          for (let row = 0; row < height; row++) {
            valueGrid[row] = [];
            for (let col = 0; col < width; col++) {
              valueGrid[row][col] = false;
            }
          }
          changeParams = true;
          current.width = width;
          current.height = height;
          current.type = "grid";
          current.value = valueGrid;
        }
      }
    }

    newParams = newParams.filter((e) => {
      if (usage[e.name] > 0) {
        return true;
      } else {
        changeParams = true;
        return false;
      }
    });

    if (changeParams === true) setParams(newParams);

    console.log(newParams);
  }, [setting]);

  const codeCompiled = useMemo(() => {
    return compileJsSoundCode(setting.code, setting.params);
  }, [setting]);

  let compute = useCallback(() => {
    if (astate && astate.audioCtx && codeCompiled.valid === true) {
      if (astate.gainNode) {
        try {
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
        } catch {
          astate.source.stop();
        }
      }

      let duration = params.find((e) => e.name === "DURATION")?.value || 1.0;
      let N = Math.ceil(astate.audioCtx.sampleRate * duration);

      let codeResult = null;
      try {
        let paramsVal = {};
        params.forEach((e) => (paramsVal[e.name] = e.value));
        codeResult = codeCompiled.func(
          N,
          astate.audioCtx.sampleRate,
          channel,
          paramsVal
        );

        if (Array.isArray(codeResult)) {
          codeResult = { samples: codeResult };
        }
      } catch {
        return;
      }

      var myArrayBuffer = astate.audioCtx.createBuffer(
        1,
        N,
        astate.audioCtx.sampleRate
      );

      for (
        var channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);

        for (var i = 0; i < myArrayBuffer.length; i++) {
          nowBuffering[i] = codeResult.samples[i];
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

      drawBuffer(
        canvasRef.current,
        codeResult.graphs || [codeResult.samples] || []
      );

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
            Play
          </button>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <button
              style={{
                padding: "10px",
                backgroundColor: "#099",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => loadPreset(tuto1)}
            >
              Tutorial 1
            </button>
            <button
              style={{
                marginLeft: "5px",
                padding: "10px",
                backgroundColor: "#099",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => loadPreset(tuto2)}
            >
              Tutorial 2
            </button>
            <button
              style={{
                marginLeft: "5px",
                padding: "10px",
                backgroundColor: "#099",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => loadPreset(tuto3)}
            >
              Tutorial 3
            </button>
            <button
              style={{
                marginLeft: "5px",
                padding: "10px",
                backgroundColor: "#099",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => loadPreset(tuto4)}
            >
              Tutorial 4
            </button>
            <button
              style={{
                marginLeft: "5px",
                padding: "10px",
                backgroundColor: "#099",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => loadPreset(tuto5)}
            >
              Tutorial 5
            </button>
          </div>
          <div style={{ fontSize: "0.8em", marginTop: "10px", color: "white" }}>
            <div> Write your sound function on the right !</div>
            <div>
              The samples you return will be played on your speaker, and the
              graphs your return plotted.
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
                {!p.type && (
                  <RSlider
                    name={p.name}
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={p.value}
                    unit={p.unit}
                    onChange={(v) =>
                      setSetting((old) => {
                        let arr = old.params.slice();
                        let elem = arr.find((e) => e.name === p.name);
                        if (elem) elem.value = v;
                        return { ...old, params: arr };
                      })
                    }
                  ></RSlider>
                )}
                {p.type === "grid" && (
                  <Grid
                    name={p.name}
                    value={p.value}
                    onChange={(newGrid) => {
                      setSetting((old) => {
                        let arr = old.params.slice();
                        let elem = arr.find((e) => e.name === p.name);
                        if (elem) elem.value = newGrid;
                        return { ...old, params: arr };
                      });
                    }}
                  ></Grid>
                )}
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
            value={code}
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
