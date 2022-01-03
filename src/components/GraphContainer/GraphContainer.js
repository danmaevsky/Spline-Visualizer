import { useState } from "react";
import useArray from "../../hooks/useArray";
import useToggle from "../../hooks/useToggle";
import { Point } from "../../kspline";
import Graph from "./Graph";
import Controller from "./Controller/Controller";
import "./GraphContainer.css";

export default function GraphContainer(props) {
  // all states that the graph will use must be communicated with the controller
  const [numPoints, setNumPoints] = useState(2);
  const [points, pointsArrayMethods] = useArray([]);
  const [enablePreset, togglePreset] = useToggle(false);
  const [presetFunction, setPreset] = useState(null);
  const [splineDegree, setSplineDegree] = useState(1);
  const [boundaryConditionType, setBoundaryConditionType] = useState("Natural");
  const [boundArray, boundArrayMethods] = useArray(Array(splineDegree - 1));

  return (
    <div className="graphContainer">
      <Graph
        numPoints={numPoints}
        points={points}
        enablePreset={enablePreset}
        presetFunction={presetFunction}
        splineDegree={splineDegree}
        boundaryConditionType={boundaryConditionType}
        boundArray={boundArray}
      />
      <Controller
        numPoints={numPoints}
        points={points}
        enablePreset={enablePreset}
        presetFunction={presetFunction}
        splineDegree={splineDegree}
        boundaryConditionType={boundaryConditionType}
        boundArray={boundArray}
        setNumPoints={setNumPoints}
        pointsArrayMethods={pointsArrayMethods}
        togglePreset={togglePreset}
        setPreset={setPreset}
        setSplineDegree={setSplineDegree}
        setBoundaryConditionType={setBoundaryConditionType}
        boundArrayMethods={boundArrayMethods}
      />
    </div>
  );
}
