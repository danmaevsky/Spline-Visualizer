import useToggle from "../../../hooks/useToggle";
import { useEffect, useState, useRef } from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./Controller.css";
import XYTable from "./XYTable";
import BoundaryConditionsTable from "./BoundaryConditionsTable";
const math = require("mathjs");

export default function Controller(props) {
  // states
  const numPoints = props.numPoints;
  const points = props.points;
  const enablePreset = props.enablePreset;
  const presetFunction = props.presetFunction;
  const splineDegree = props.splineDegree;
  const boundaryConditionType = props.boundaryConditionType;
  const boundArray = props.boundArray;
  // state setters
  const setNumPoints = props.setNumPoints;
  const pointsArrayMethods = props.pointsArrayMethods;
  const togglePreset = props.togglePreset;
  const setPreset = props.setPreset;
  const setSplineDegree = props.setSplineDegree;
  const setBoundaryConditionType = props.setBoundaryConditionType;
  const boundArrayMethods = props.boundArrayMethods;

  return (
    <div className="controller">
      <div className="controllerTop">
        <NumDataBox
          numPoints={numPoints}
          setNumPoints={setNumPoints}
          pointsArrayMethods={pointsArrayMethods}
          boundaryConditionType={boundaryConditionType}
        />
        <PresetFunctionBox enablePreset={enablePreset} togglePreset={togglePreset} presetFunction={presetFunction} setPreset={setPreset} />
        <SplineDegreeBox
          splineDegree={splineDegree}
          setSplineDegree={setSplineDegree}
          boundaryConditionType={boundaryConditionType}
          boundArrayMethods={boundArrayMethods}
        />
        <SelectBoundCondBox setBoundaryConditionType={setBoundaryConditionType} splineDegree={splineDegree} boundArrayMethods={boundArrayMethods} />
      </div>
      <div className="controllerBottom">
        <XYTable numPoints={numPoints} pointsArrayMethods={pointsArrayMethods} enablePreset={enablePreset} presetFunction={presetFunction} />
        <BoundaryConditionsTable splineDegree={splineDegree} boundaryConditionType={boundaryConditionType} boundArrayMethods={boundArrayMethods} />
      </div>
    </div>
  );
}

function NumDataBox(props) {
  const numPoints = props.numPoints;
  const setNumPoints = props.setNumPoints;
  const pointsArrayMethods = props.pointsArrayMethods;
  const boundaryConditionType = props.boundaryConditionType;
  const isNotAKnot = boundaryConditionType === "Not-a-Knot + Natural" || boundaryConditionType === "Not-a-Knot + Clamped";
  const [value, setValue] = useState(numPoints);
  const [isValid, setIsValid] = useState(true);

  // sanitize the input
  const onChange = (input) => {
    let min = 2;
    if (isNotAKnot) {
      min = 4;
    }
    if (input === "") {
      // setIsValid(false);
      setValue(undefined);
      return;
    }
    let numerical = Number(input);
    if (!(typeof numerical === "number") || Number.isNaN(numerical)) {
      // setIsValid(false);
      setValue(undefined);
      return;
    } else if (numerical < min) {
      // setIsValid(false);
      setValue(numerical);
      return;
    } else if (numerical > 10) {
      // setIsValid(false);
      setValue(numerical);
      return;
    }
    setNumPoints(numerical);
    setValue(numerical);
    pointsArrayMethods.clear();
    // setIsValid(true);
  };

  useEffect(() => {
    pointsArrayMethods.set(Array(numPoints).fill(undefined));
  }, [numPoints]);

  useEffect(() => {
    if (isNotAKnot) {
      if (value < 4 || value === undefined) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      if (value < 2 || value === undefined) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  });

  return (
    <div className="numDataBox">
      <p>Number of Data Points:</p>
      <InputBox className="numDataInputBox" displayValue={numPoints} callback={(input) => onChange(input)} />
      {!isValid && !isNotAKnot ? (
        <p className="invalidNumData">
          Please enter a <b>number</b> between <b>2 and 10</b>
        </p>
      ) : null}
      {!isValid && isNotAKnot ? (
        <p className="invalidNumData">
          Please enter at least <b>4 data points</b> when using a Not-a-Knot condition
        </p>
      ) : null}
    </div>
  );
}

function PresetFunctionBox(props) {
  const enablePreset = props.enablePreset;
  const togglePreset = props.togglePreset;
  const presetFunction = props.presetFunction;
  const setPreset = props.setPreset;

  const presets = ["Exponential", "Logarithm", "Sine", "Cosine", "Hyperbolic Tangent", "Factorial", "Gamma"];

  // string-to-function switcher
  const onSelection = (funcSelection) => {
    if (!presets.includes(funcSelection)) {
      return;
    }
    if (funcSelection === "Exponential") {
      setPreset(() => (x) => Math.exp(x));
    } else if (funcSelection === "Logarithm") {
      setPreset(() => (x) => Math.log(x));
    } else if (funcSelection === "Sine") {
      setPreset(() => (x) => Math.sin(x));
    } else if (funcSelection === "Cosine") {
      setPreset(() => (x) => Math.cos(x));
    } else if (funcSelection === "Hyperbolic Tangent") {
      setPreset(() => (x) => Math.tanh(x));
    } else if (funcSelection === "Factorial") {
      setPreset(() => (x) => math.factorial(x));
    } else if (funcSelection === "Gamma") {
      setPreset(() => (x) => math.gamma(x));
    }
  };

  return (
    <div className="presetFunctionBox">
      <TogglePresetButton enablePreset={enablePreset} togglePreset={togglePreset} />
      <div className="presetFunctionBoxInnerBox">
        <p>Preset Function:</p>
        <DropDownMenu menuItems={presets} callback={onSelection} />
      </div>
    </div>
  );
}

function TogglePresetButton(props) {
  const enablePreset = props.enablePreset;
  const togglePreset = props.togglePreset;

  return (
    <div className="togglePresetButton" onClick={togglePreset}>
      <svg className="togglePresetSvg" viewBox="0px 0px 14px 14px">
        {enablePreset ? (
          <circle cx="7" cy="7" r="6px" stroke="#001e55" fill="#cee0ff"></circle>
        ) : (
          <circle cx="7" cy="7" r="6px" stroke="#001e55" fill="#ffffff"></circle>
        )}
      </svg>
    </div>
  );
}

function SplineDegreeBox(props) {
  const splineDegree = props.splineDegree;
  const setSplineDegree = props.setSplineDegree;
  const boundaryConditionType = props.boundaryConditionType;
  const boundArrayMethods = props.boundArrayMethods;

  const onChange = (newValue) => {
    let k = Number(newValue);
    setSplineDegree(k);
    if (boundaryConditionType === "Not-a-Knot + Clamped" || boundaryConditionType === "Not-a-Knot + Natural") {
      let kOffset = k > 1 ? (k > 2 ? 2 : 1) : 0;
      boundArrayMethods.set(new Array(k - 1 - kOffset).fill(undefined));
    } else {
      boundArrayMethods.set(new Array(k - 1).fill(undefined));
    }
  };

  return (
    <div className="splineDegreeBox">
      <p>Spline Degree:</p>
      <Slider className="degreeSlider" min={1} max={10} onChange={(e) => onChange(e)} />
      <p>{splineDegree}</p>
    </div>
  );
}

function SelectBoundCondBox(props) {
  //   const boundaryConditionType = props.boundaryConditionType;
  const setBoundaryConditionType = props.setBoundaryConditionType;
  const splineDegree = props.splineDegree;
  const boundArrayMethods = props.boundArrayMethods;

  const onSelection = (condSelection) => {
    setBoundaryConditionType(condSelection);
    if (condSelection === "Not-a-Knot + Clamped" || condSelection === "Not-a-Knot + Natural") {
      let kOffset = splineDegree > 1 ? (splineDegree > 2 ? 2 : 1) : 0;
      boundArrayMethods.set(new Array(splineDegree - 1 - kOffset).fill(undefined));
    } else {
      boundArrayMethods.set(new Array(splineDegree - 1).fill(undefined));
    }
  };

  const types = ["Natural", "Clamped", "Not-a-Knot + Natural", "Not-a-Knot + Clamped"];

  return (
    <div className="boundConditionTypeBox">
      <p>Boundary Conditions:</p>
      <DropDownMenu menuItems={types} callback={onSelection} />
    </div>
  );
}

function DropDownMenu(props) {
  const menuItems = props.menuItems;
  const callback = props.callback !== undefined ? props.callback : () => {};
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const [isOpen, toggleIsOpen] = useToggle(false);

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      toggleIsOpen(false);
    }
  };

  const initialRender = useRef(false);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      callback(selectedItem);
      toggleIsOpen(false);
    }
  }, [selectedItem]);

  return (
    <div className="dropdown" tabIndex={1} onBlur={(e) => onClickOutside(e)}>
      <div className="selectedDropdownItem" onClick={() => toggleIsOpen()}>
        <p>{selectedItem}</p>
      </div>
      {isOpen ? (
        <div className="unselectedDropdownItems">
          {menuItems.map((item) => {
            if (item !== selectedItem) {
              return (
                <div className="dropdownItem" onClick={() => setSelectedItem(item)}>
                  <p>{item}</p>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      ) : null}
    </div>
  );
}

export function InputBox(props) {
  const className = props.className;
  const callback = props.callback !== undefined ? props.callback : () => {};
  const [value, setValue] = useState(props.displayValue);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      callback(value);
    }
  }, [value]);

  return (
    <input
      className={className}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      value={value}
    ></input>
  );
}
