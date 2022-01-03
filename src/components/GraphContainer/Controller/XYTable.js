import { useState, useEffect, useRef } from "react";
import useArray from "../../../hooks/useArray";
import { Point } from "../../../kspline";
import { InputBox } from "./Controller";
import "./XYTable.css";

export default function XYTable(props) {
  const numPoints = props.numPoints;
  const pointsArrayMethods = props.pointsArrayMethods;
  const enablePreset = props.enablePreset;
  const presetFunction = props.presetFunction;

  let rows = [];
  let alt = false;
  for (let i = 0; i < numPoints; i++) {
    rows.push(
      <XYTableRow
        id={i}
        alt={alt}
        numPoints={numPoints}
        pointsArrayMethods={pointsArrayMethods}
        enablePreset={enablePreset}
        presetFunction={presetFunction}
      />
    );
    alt = !alt;
  }

  return (
    <div className="xyTable">
      <Header />
      {rows}
    </div>
  );
}

function Header() {
  return (
    <div className="xyTableHeader">
      <div>
        <p>X</p>
      </div>
      <div>
        <p>Y</p>
      </div>
    </div>
  );
}

function XYTableRow(props) {
  const id = props.id;
  const alt = props.alt;
  const numPoints = props.numPoints;
  const pointsArrayMethods = props.pointsArrayMethods;
  const enablePreset = props.enablePreset;
  const presetFunction = props.presetFunction;

  const [x, setX] = useState(undefined);
  const [y, setY] = useState(undefined);
  const [dispX, setDispX] = useState(x);
  const [dispY, setDispY] = useState(y);

  const onInputX = (input) => {
    setDispX(input);
    if (input === "") {
      setX(undefined);
      return;
    }

    let numerical = Number(input);
    if (Number.isNaN(numerical)) {
      setX(undefined);
      return;
    }
    setX(numerical);
  };

  const onInputY = (input) => {
    setDispY(input);
    if (input === "") {
      setY(undefined);
      return;
    }

    let numerical = Number(input);
    if (Number.isNaN(numerical)) {
      setY(undefined);
      return;
    }
    setY(numerical);
  };

  const onInputX_enablePreset = (input) => {
    setDispX(input);
    if (input === "") {
      setX(undefined);
      setY(undefined);
      return;
    }

    let numerical = Number(input);
    if (Number.isNaN(numerical)) {
      setX(undefined);
      return;
    }
    setX(numerical);
    setY(presetFunction(numerical));
  };

  useEffect(() => {
    if (!(x === undefined || y === undefined)) {
      pointsArrayMethods.update(id, new Point(x, y));
    } else {
      pointsArrayMethods.update(id, undefined);
    }
  }, [x, y]);

  useEffect(() => {
    setX(undefined);
    setY(undefined);
    setDispX("");
    setDispY("");
    pointsArrayMethods.set(new Array(numPoints).fill(undefined));
  }, [enablePreset, numPoints, presetFunction]);

  if (enablePreset) {
    return (
      <div className={alt ? "tableRow-alt" : "tableRow"}>
        <input className="tableRowX" onChange={(e) => onInputX_enablePreset(e.target.value)} value={dispX}></input>
        <div>
          <p>{y === undefined ? "" : Math.round(y * 100000) / 100000}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={alt ? "tableRow-alt" : "tableRow"}>
      <input className="tableRowX" onChange={(e) => onInputX(e.target.value)} value={dispX}></input>
      <input className="tableRowY" onChange={(e) => onInputY(e.target.value)} value={dispY}></input>
    </div>
  );
}
