import { Spline, Point } from "../../kspline";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js";
import "./Graph.css";
const Plot = createPlotlyComponent(Plotly);
const math = require("mathjs");

export default function Graph(props) {
  const pointColor = "#ff8d14";
  const functionColor = "#03c234";
  const splineColor = "#0f6ee7";
  const numPoints = props.numPoints;
  let points = props.points;
  const enablePreset = props.enablePreset;
  const presetFunction = props.presetFunction;
  const splineDegree = props.splineDegree;
  const boundaryConditionType = props.boundaryConditionType;
  let boundArray = props.boundArray;
  const isNotAKnot = boundaryConditionType === "Not-a-Knot + Natural" || boundaryConditionType === "Not-a-Knot + Clamped";

  // isGraphable_Points boolean to know when the xArray and yArray are
  // actually populated. This means no "undefined" values
  const isGraphable_Points = points !== undefined && points.length >= 1;
  if (isGraphable_Points) {
    points = points.slice(0, numPoints);
    points = points.filter((p) => p !== undefined);
  }

  // isGraphable_Spline boolean to know when the Spline is ready to be
  // graphed. This means the boundArray has no "undefined" values if
  // a clamped boundary condition is chosen
  let boundArrayReady = true;
  boundArray = boundArray.slice(0, splineDegree - 1);
  if (boundaryConditionType === "Clamped" || boundaryConditionType === "Not-a-Knot + Clamped") {
    boundArrayReady = !boundArray.includes(undefined);
  }
  let isGraphable_Spline = isGraphable_Points && points.length === numPoints && boundArrayReady;
  if (isNotAKnot && numPoints < 4) {
    isGraphable_Spline = false;
  }
  let solvingError = false;

  // isGraphable_Function boolean to know when it is time to graph the
  // preset function. Only do this once all the x-values are populated
  // and if the user wants a preset function
  const isGraphable_Function = isGraphable_Points && enablePreset;

  // populating the different graphed components
  points = points.sort((p1, p2) => p1.x > p2.x);
  let xPoints = points.map((point) => point.x);
  let yPoints = points.map((point) => point.y);

  let xIncrements = null;
  if (isGraphable_Points) {
    xIncrements = LinSpace(xPoints[0], xPoints[xPoints.length - 1], 0.01);
  }

  let yFunction = null;
  if (isGraphable_Function) {
    yFunction = xIncrements.map((x) => presetFunction(x));
  }

  let ySpline = null;
  if (isGraphable_Spline) {
    try {
      let temp = !boundArray.includes(undefined) ? boundArray.map((p) => p.value) : [];
      let S = new Spline(math.matrix(xPoints), math.matrix(yPoints), splineDegree, boundaryConditionType, temp);
      ySpline = xIncrements.map((x) => S.evaluate(x));
    } catch {
      isGraphable_Spline = false;
      solvingError = true;
    }
  }

  if (solvingError && isGraphable_Points && !isGraphable_Function) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
            {
              mode: "lines",
              line: {
                color: functionColor,
              },
            },
            {
              mode: "lines",
              line: {
                color: splineColor,
              },
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
        <p className="solvingError">
          The chosen combination of parameters leads to either an inconsistent system or a system with infinitely many solutions, so it can't be
          solved for a unique spline. Sorry!
        </p>
      </div>
    );
  } else if (solvingError && isGraphable_Points && isGraphable_Function) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "lines",
              name: "Preset Function",
              line: {
                color: functionColor,
              },
              x: xIncrements,
              y: yFunction,
            },
            {
              mode: "lines",
              line: {
                color: splineColor,
              },
            },
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
        <p className="solvingError">
          The chosen combination of parameters leads to either an inconsistent system or a system with infinitely many solutions, so it can't be
          solved for a unique spline. Sorry!
        </p>
      </div>
    );
  } else if (isGraphable_Points && !isGraphable_Function && !isGraphable_Spline) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "lines",
              line: {
                color: functionColor,
              },
            },
            {
              mode: "lines",
              line: {
                color: splineColor,
              },
            },
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
      </div>
    );
  } else if (isGraphable_Points && isGraphable_Function && !isGraphable_Spline) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "lines",
              name: "Preset Function",
              line: {
                color: functionColor,
              },
              x: xIncrements,
              y: yFunction,
            },
            {
              mode: "lines",
              line: {
                color: splineColor,
              },
            },
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
      </div>
    );
  } else if (isGraphable_Points && isGraphable_Function && isGraphable_Spline) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "lines",
              name: "Preset Function",
              line: {
                color: functionColor,
              },
              x: xIncrements,
              y: yFunction,
            },
            {
              mode: "lines",
              name: "Spline",
              line: {
                color: splineColor,
              },
              x: xIncrements,
              y: ySpline,
            },
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
      </div>
    );
  } else if (isGraphable_Points && !isGraphable_Function && isGraphable_Spline) {
    return (
      <div className="plot">
        <Plot
          data={[
            {
              mode: "lines",
              line: {
                color: functionColor,
              },
            },
            {
              mode: "lines",
              name: "Spline",
              line: {
                color: "#0f6ee7",
              },
              x: xIncrements,
              y: ySpline,
            },
            {
              mode: "markers",
              name: "Data Points",
              marker: {
                color: pointColor,
                size: 10,
              },
              x: xPoints,
              y: yPoints,
            },
          ]}
          layout={{
            width: 700,
            height: 700,
            title: "",
          }}
        />
      </div>
    );
  }
  return (
    <div className="plot">
      <Plot
        data={[
          {
            mode: "lines",
            line: {
              color: functionColor,
            },
          },
          {
            mode: "lines",
            line: {
              color: splineColor,
            },
          },
          {
            mode: "markers",
            name: "Data Points",
            marker: {
              color: "orange",
              size: 10,
            },
          },
        ]}
        layout={{
          width: 700,
          height: 700,
          title: "",
        }}
      />
    </div>
  );
}

function LinSpace(Xo, Xn, step) {
  let space = [];
  for (let i = Xo; i <= Xn; i = Math.round((i + step) * 1000) / 1000) {
    space.push(i);
  }
  return space;
}
