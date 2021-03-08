import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
var cloneDeep = require("lodash.clonedeep");

export default function Grid({ name, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          textAlign: "left",
          color: "grey",
          fontSize: "0.7em",
          fontWeight: "bold",
        }}
      >
        {name}
      </div>
      {value.map((row, rowIndex) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: row.length * 20 + "px",
            height: "20px",
          }}
        >
          {row.map((col, colIndex) => (
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: col ? "rgb(100, 153, 211)" : "#465",
                borderRadius: "3px",
              }}
              onClick={() => {
                let newVal = cloneDeep(value);
                newVal[rowIndex][colIndex] = !newVal[rowIndex][colIndex];
                onChange(newVal);
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
