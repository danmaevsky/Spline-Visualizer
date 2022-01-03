import { useEffect, useState } from "react";
import "./BoundaryConditionsTable.css";

export default function BoundaryConditionsTable(props) {
  const splineDegree = props.splineDegree;
  const boundaryConditionType = props.boundaryConditionType;
  const boundArrayMethods = props.boundArrayMethods;
  const numCond = splineDegree - 1;

  let leftRows = [];
  let rightRows = [];
  let id = 0;
  if (boundaryConditionType === "Natural") {
    for (let i = 0; i < Math.floor(numCond / 2); i++) {
      leftRows.push(<NaturalTableRow order={numCond - i} isLeft={true} />);
    }
    for (let i = 0; i < Math.ceil(numCond / 2); i++) {
      rightRows.push(<NaturalTableRow order={numCond - i} isLeft={false} />);
    }
  } else if (boundaryConditionType === "Not-a-Knot + Natural") {
    if (splineDegree > 1) {
      leftRows.push(<NotAKnotTableRow order={splineDegree} isLeft={true} />);
    }
    if (splineDegree > 2) {
      rightRows.push(<NotAKnotTableRow order={splineDegree} isLeft={false} />);
    }

    for (let i = 0; i < Math.floor((numCond - 2) / 2); i++) {
      leftRows.push(<NaturalTableRow order={numCond - i} isLeft={true} />);
      id++;
    }
    for (let i = 0; i < Math.ceil((numCond - 2) / 2); i++) {
      rightRows.push(<NaturalTableRow order={numCond - i} isLeft={false} />);
      id++;
    }
  } else if (boundaryConditionType === "Not-a-Knot + Clamped") {
    if (splineDegree > 1) {
      leftRows.push(<NotAKnotTableRow order={splineDegree} isLeft={true} />);
    }
    if (splineDegree > 2) {
      rightRows.push(<NotAKnotTableRow order={splineDegree} isLeft={false} />);
    }
    for (let i = 0; i < Math.ceil((numCond - 2) / 2); i++) {
      leftRows.push(
        <TableRowWithInput
          id={id}
          order={i + 1}
          isLeft={true}
          boundArrayMethods={boundArrayMethods}
          splineDegree={splineDegree}
          boundaryConditionType={boundaryConditionType}
        />
      );
      id++;
    }
    for (let i = 0; i < Math.floor((numCond - 2) / 2); i++) {
      rightRows.push(
        <TableRowWithInput
          id={id}
          order={i + 1}
          isLeft={false}
          boundArrayMethods={boundArrayMethods}
          splineDegree={splineDegree}
          boundaryConditionType={boundaryConditionType}
        />
      );
      id++;
    }
  } else if (boundaryConditionType === "Clamped") {
    for (let i = 0; i < Math.ceil(numCond / 2); i++) {
      leftRows.push(
        <TableRowWithInput
          id={id}
          order={i + 1}
          isLeft={true}
          boundArrayMethods={boundArrayMethods}
          splineDegree={splineDegree}
          boundaryConditionType={boundaryConditionType}
        />
      );
      id++;
    }
    for (let i = 0; i < Math.floor(numCond / 2); i++) {
      rightRows.push(
        <TableRowWithInput
          id={id}
          order={i + 1}
          isLeft={false}
          boundArrayMethods={boundArrayMethods}
          splineDegree={splineDegree}
          boundaryConditionType={boundaryConditionType}
        />
      );
      id++;
    }
  }

  let className = "boundaryConditionsTable";
  if (boundaryConditionType === "Natural" || boundaryConditionType === "Not-a-Knot + Natural") {
    className = "boundaryConditionsTable-Natural";
  }

  return (
    <div className={className}>
      <Header />
      {numCond > 0 ? (
        <div className="conditions">
          <div className="leftBoundaryConditions">{leftRows}</div>
          <div className="rightBoundaryConditions">{rightRows}</div>
        </div>
      ) : null}
    </div>
  );
}

function Header() {
  return (
    <div className="boundaryConditionsTableHeader">
      <p>Boundary Conditions</p>
    </div>
  );
}

function NaturalTableRow(props) {
  const order = props.order;
  const isLeft = props.isLeft;
  return (
    <div className="boundaryTableRow">
      <p>
        S<sup>({order})</sup>(x<sub>{isLeft ? 0 : "N"}</sub>) =
      </p>
      <p>0</p>
    </div>
  );
}

function NotAKnotTableRow(props) {
  const order = props.order;
  const isLeft = props.isLeft;
  return (
    <div className="boundaryTableRow-Not-a-Knot">
      <p>
        S<sub>{isLeft ? 0 : "N-2"}</sub>
        <sup>({order})</sup>(x<sub>{isLeft ? 1 : "N-1"}</sub>) = S<sub>{isLeft ? 1 : "N-1"}</sub>
        <sup>({order})</sup>(x<sub>{isLeft ? 1 : "N-1"}</sub>)
      </p>
    </div>
  );
}

function TableRowWithInput(props) {
  const id = props.id;
  const order = props.order;
  const isLeft = props.isLeft;
  const boundArrayMethods = props.boundArrayMethods;
  const splineDegree = props.splineDegree;
  const boundaryConditionType = props.boundaryConditionType;
  const [value, setValue] = useState(undefined);
  const [dispValue, setDispValue] = useState(value);

  const onInput = (input) => {
    setDispValue(input);
    if (input === "") {
      setValue(undefined);
      return;
    }

    let numerical = Number(input);
    if (Number.isNaN(numerical)) {
      setValue(undefined);
      return;
    }

    setValue({
      order: order,
      value: numerical,
    });
  };

  useEffect(() => {
    if (value === undefined) {
      boundArrayMethods.update(id, undefined);
    } else {
      boundArrayMethods.update(id, value);
    }
  }, [value]);

  useEffect(() => {
    setValue(undefined);
    setDispValue("");
  }, [splineDegree, boundaryConditionType]);

  return (
    <div className="boundaryTableRow">
      <p>
        S<sup>({order})</sup>(x<sub>{isLeft ? 0 : "N"}</sub>) =
      </p>
      <input className="boundaryConditionsInput" value={dispValue} onChange={(e) => onInput(e.target.value)}></input>
    </div>
  );
}
