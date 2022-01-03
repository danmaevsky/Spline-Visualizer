const math = require("mathjs");

function kspline(X, Y, k, boundaryConditionType, boundArray) {
  if (boundaryConditionType === undefined) {
    boundaryConditionType = "Natural";
  }

  let n = X.size()[0] - 1;
  let A = math.zeros((k + 1) * n, (k + 1) * n);
  let b = math.zeros((k + 1) * n, 1);
  let eq = 0;

  // Populate A with "Fitting and Knot Equations"
  for (let i = 1; i <= n; i++) {
    let row1 = math.zeros(1, (k + 1) * n);
    let row2 = math.zeros(1, (k + 1) * n);

    for (let p = 0; p <= k; p++) {
      let indexInRow = i * (k + 1) - p;
      row1.subset(math.index(0, indexInRow - 1), math.pow(X.subset(math.index(i - 1)), p));
      row2.subset(math.index(0, indexInRow - 1), math.pow(X.subset(math.index(i)), p));
    }
    // row1.subset(math.index(0, row1.size()[1] - 1), Y.subset(math.index(i - 1)));
    // row2.subset(math.index(0, row2.size()[1] - 1), Y.subset(math.index(i)));
    A.subset(math.index(eq, math.range(0, (k + 1) * n)), row1);
    b.subset(math.index(eq, 0), Y.subset(math.index(i - 1)));
    eq++;
    A.subset(math.index(eq, math.range(0, (k + 1) * n)), row2);
    b.subset(math.index(eq, 0), Y.subset(math.index(i)));
    eq++;
  }

  // Populate A with Derivative Equations
  for (let m = 1; m <= k - 1; m++) {
    for (let i = 1; i <= n - 1; i++) {
      let row = math.zeros(1, (k + 1) * n);
      for (let t = k; t >= m; t--) {
        let index1InRow = i * (k + 1) - t;
        let val1 = npermutek(t, m) * math.pow(X.subset(math.index(i)), t - m);
        row.subset(math.index(0, index1InRow - 1), val1);

        let index2InRow = (i + 1) * (k + 1) - t;
        let val2 = -npermutek(t, m) * math.pow(X.subset(math.index(i)), t - m);
        row.subset(math.index(0, index2InRow - 1), val2);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      b.subset(math.index(eq, 0), 0);
      eq++;
    }
  }

  if (boundaryConditionType === "Natural") {
    // Populate A with Natural Boundary Conditions
    let BC = 0;
    let m = k - 1;
    // Toggle between boundary at X_n and X_0 for Natural BC
    let right = true;
    while (BC < k - 1) {
      let row = math.zeros(1, (k + 1) * n);
      if (right) {
        let i = n;
        for (let t = k; t >= m; t--) {
          let indexInRow = i * (k + 1) - t;
          let val = npermutek(t, m) * math.pow(X.subset(math.index(n)), t - m);
          row.subset(math.index(0, indexInRow - 1), val);
        }
      } else {
        let i = 1;
        for (let t = k; t >= m; t--) {
          let indexInRow = i * (k + 1) - t;
          let val = npermutek(t, m) * math.pow(X.subset(math.index(0)), t - m);
          row.subset(math.index(0, indexInRow - 1), val);
        }
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      right = !right;
      BC++;
      if (right) {
        m--;
      }
    }
  } else if (boundaryConditionType === "Clamped") {
    // Populate A with the given Clamped Boundary Conditions, starting at the lowest order derivative
    let m = 1;
    // Prioritize Left BC by applying ceil() to them. ceil() and floor() should partition the total BC count exactly
    const leftBC_MAX = Math.ceil((k - 1) / 2);
    const rightBC_MAX = Math.floor((k - 1) / 2);
    let leftBC = 0;
    let rightBC = 0;

    while (leftBC < leftBC_MAX) {
      let row = math.zeros(1, (k + 1) * n);
      let i = 1;
      for (let t = k; t >= m; t--) {
        let indexInRow = i * (k + 1) - t;
        let val = npermutek(t, m) * math.pow(X.subset(math.index(0)), t - m);
        row.subset(math.index(0, indexInRow - 1), val);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      b.subset(math.index(eq, 0), boundArray[leftBC]);
      eq++;
      leftBC++;
      m++;
    }

    m = 1;

    while (rightBC < rightBC_MAX) {
      let row = math.zeros(1, (k + 1) * n);
      let i = n;
      for (let t = k; t >= m; t--) {
        let indexInRow = i * (k + 1) - t;
        let val = npermutek(t, m) * math.pow(X.subset(math.index(n)), t - m);
        row.subset(math.index(0, indexInRow - 1), val);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      b.subset(math.index(eq, 0), boundArray[leftBC_MAX + rightBC]);
      eq++;
      rightBC++;
      m++;
    }
  } else if (boundaryConditionType === "Not-a-Knot + Natural") {
    let BC = 0;
    let m = k;
    if (k > 1 && n > 2) {
      let i = 1;
      let row = math.zeros(1, (k + 1) * n);
      for (let t = k; t >= m; t--) {
        let index1InRow = i * (k + 1) - t;
        // this is the Not-a-Knot condition: a0 = a1
        let val1 = 1;
        row.subset(math.index(0, index1InRow - 1), val1);

        let index2InRow = (i + 1) * (k + 1) - t;
        let val2 = -1;
        row.subset(math.index(0, index2InRow - 1), val2);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      BC++;
    }

    if (k > 2 && n > 2) {
      let i = n;
      let row = math.zeros(1, (k + 1) * n);
      for (let t = k; t >= m; t--) {
        let index1InRow = (i - 1) * (k + 1) - t;
        // this is the Not-a-Knot condition: a(n-2) = a(n-1)
        let val1 = 1;
        row.subset(math.index(0, index1InRow - 1), val1);

        let index2InRow = i * (k + 1) - t;
        let val2 = -1;
        row.subset(math.index(0, index2InRow - 1), val2);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      BC++;
    }

    // the rest will be natural
    m = k - 1;
    // Toggle between boundary at X_n and X_0 for Natural BC
    let right = true;
    while (BC < k - 1) {
      let row = math.zeros(1, (k + 1) * n);
      if (right) {
        let i = n;
        for (let t = k; t >= m; t--) {
          let indexInRow = i * (k + 1) - t;
          let val = npermutek(t, m) * math.pow(X.subset(math.index(n)), t - m);
          row.subset(math.index(0, indexInRow - 1), val);
        }
      } else {
        let i = 1;
        for (let t = k; t >= m; t--) {
          let indexInRow = i * (k + 1) - t;
          let val = npermutek(t, m) * math.pow(X.subset(math.index(0)), t - m);
          row.subset(math.index(0, indexInRow - 1), val);
        }
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      right = !right;
      BC++;
      if (right) {
        m--;
      }
    }
  } else if (boundaryConditionType === "Not-a-Knot + Clamped") {
    const leftBC_MAX = Math.ceil((k - 1) / 2);
    const rightBC_MAX = Math.floor((k - 1) / 2);
    let leftBC = 0;
    let leftOffset = 0;
    let rightBC = 0;
    let rightOffset = 0;
    let m = k;
    if (k > 1 && n > 2) {
      let i = 1;
      let row = math.zeros(1, (k + 1) * n);
      for (let t = k; t >= m; t--) {
        let index1InRow = i * (k + 1) - t;
        // this is the Not-a-Knot condition: a0 = a1
        let val1 = 1;
        row.subset(math.index(0, index1InRow - 1), val1);

        let index2InRow = (i + 1) * (k + 1) - t;
        let val2 = -1;
        row.subset(math.index(0, index2InRow - 1), val2);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      leftBC++;
      leftOffset++;
    }

    if (k > 2 && n > 2) {
      let i = n;
      let row = math.zeros(1, (k + 1) * n);
      for (let t = k; t >= m; t--) {
        let index1InRow = (i - 1) * (k + 1) - t;
        // this is the Not-a-Knot condition: a(n-2) = a(n-1)
        let val1 = 1;
        row.subset(math.index(0, index1InRow - 1), val1);

        let index2InRow = i * (k + 1) - t;
        let val2 = -1;
        row.subset(math.index(0, index2InRow - 1), val2);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      eq++;
      rightBC++;
      rightOffset++;
    }

    // the rest will be Clamped
    m = 1;
    while (leftBC < leftBC_MAX) {
      let row = math.zeros(1, (k + 1) * n);
      let i = 1;
      for (let t = k; t >= m; t--) {
        let indexInRow = i * (k + 1) - t;
        let val = npermutek(t, m) * math.pow(X.subset(math.index(0)), t - m);
        row.subset(math.index(0, indexInRow - 1), val);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      b.subset(math.index(eq, 0), boundArray[leftBC - leftOffset]);
      eq++;
      leftBC++;
      m++;
    }

    m = 1;
    while (rightBC < rightBC_MAX) {
      let row = math.zeros(1, (k + 1) * n);
      let i = n;
      for (let t = k; t >= m; t--) {
        let indexInRow = i * (k + 1) - t;
        let val = npermutek(t, m) * math.pow(X.subset(math.index(n)), t - m);
        row.subset(math.index(0, indexInRow - 1), val);
      }
      A.subset(math.index(eq, math.range(0, (k + 1) * n)), row);
      b.subset(math.index(eq, 0), boundArray[leftBC_MAX + rightBC - rightOffset - leftOffset]);
      eq++;
      rightBC++;
      m++;
    }
  }

  let S = math.lusolve(A, b);
  return math.reshape(S, [n, k + 1]);
}

function npermutek(n, k) {
  if (k > n) {
    return 0;
  } else if (k < 0) {
    let e = new Error("Domain Error for nPk: k must be a nonnegative integer");
    throw e;
  }
  return math.factorial(n) / math.factorial(n - k);
}

export class Spline {
  constructor(X, Y, k, boundaryConditionType, boundArray) {
    let C = kspline(X, Y, k, boundaryConditionType, boundArray);
    console.log("C: ");
    console.log(C);
    this.pieces = [];
    for (let i = 0; i < C.size()[0]; i++) {
      let coeff = C.subset(math.index(i, math.range(0, C.size()[1])));
      let interval = [X.subset(math.index(i)), X.subset(math.index(i + 1))];
      this.pieces.push(new SplinePiece(coeff, interval));
    }
  }

  evaluate(x) {
    let pieceIndex = this.findPiece(x);
    return this.pieces[pieceIndex].evaluate(x);
  }

  findPiece(x) {
    let hi = this.pieces.length;
    let lo = 0;
    let mid = Math.floor(lo + (hi - lo) / 2);

    while (lo < hi) {
      if (x < this.pieces[mid].interval[0]) {
        hi = mid - 1;
        mid = Math.floor(lo + (hi - lo) / 2);
      } else if (x > this.pieces[mid].interval[1]) {
        lo = mid + 1;
        mid = Math.floor(lo + (hi - lo) / 2);
      } else {
        return mid;
      }
    }

    return mid;
  }
}

class SplinePiece {
  constructor(coefficients, interval) {
    this.coefficients = [];
    for (let i = 0; i < coefficients.size()[1]; i++) {
      this.coefficients.push(coefficients.subset(math.index(0, i)));
    }
    this.interval = interval;
  }

  evaluate(x) {
    if (x < this.interval[0] || x > this.interval[1]) {
      return null;
    } else {
      let ans = 0;
      let length = this.coefficients.length;
      for (let i = 0; i < length; i++) {
        ans += this.coefficients[length - 1 - i] * math.pow(x, i);
      }
      return ans;
    }
  }
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
