import "./InfoCards.css";
import { useState } from "react";
import logo from "../../logo.svg";
import covid from "./spline_covid.png";
import NumPoints from "./NumPoints.gif";
import PresetFunction from "./PresetFunction.gif";
import SplineDegree from "./SplineDegree.gif";
import Bound from "./Bound.gif";
import Tables from "./Tables.gif";

class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  put(data) {
    if (this.first === null) {
      this.first = new LinkedListNode(data);
      this.last = this.first;
      this.size++;
    } else if (this.last !== null) {
      this.last.next = new LinkedListNode(data);
      this.last.next.prev = this.last;
      this.last = this.last.next;
    }
  }
}

let cardList = new LinkedList();
cardList.put(<WelcomeCard />);
cardList.put(<Card1 />);
cardList.put(<Card2 />);
cardList.put(<Card3 />);
cardList.put(<Card4 />);
cardList.put(<Card5 />);
cardList.put(<Card6 />);
cardList.put(<Card7 />);
cardList.put(<Card8 />);
cardList.put(<Card9 />);
cardList.put(<Card10 />);

export default function InfoCards(props) {
  const { setShowCards } = props;
  const [curr, setCurr] = useState(cardList.first);
  return (
    <div className="infoCard">
      {curr.data}
      <div className="next-prevButtons">
        {curr.prev !== null ? (
          <button className="cardButton" onClick={() => setCurr(curr.prev)}>
            {"Previous"}
          </button>
        ) : null}
        {curr.next !== null ? (
          <button className="cardButton" onClick={() => setCurr(curr.next)}>
            {"Next"}
          </button>
        ) : null}
      </div>
      <button
        className="cardButton exitButton"
        onClick={() => {
          setCurr(cardList.first);
          setShowCards(false);
        }}
      >
        Exit
      </button>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="infoCard-Body">
      <h1>Welcome to the Spline Visualizer!</h1>
      <p>These cards will serve as a tutorial for the application, as well as provide some background into splines.</p>
      <p>To exit the tutorial if you want to hop right in, just click the Exit button!</p>
      <img className="logo" src={logo} alt="Spline App Logo" />
    </div>
  );
}

function Card1() {
  return (
    <div className="infoCard-Body">
      <h1>What is a Spline?</h1>
      <p>
        To put it simply, splines are piecewise polynomial functions that are constructed to fit some data with one goal in mind: <b>Interpolation</b>
        .
      </p>
      <p>
        Interpolation is the idea that if you only know a few points on some <b>unknown</b> function, a function you can't figure out, you can fill in
        the gaps between those points with a function that you do know how to figure out, like parabolas or cubics.
      </p>
      <img className="logo" src={covid} alt="Applying Splines on Coronavirus data" />
    </div>
  );
}

function Card2() {
  return (
    <div className="infoCard-Body">
      <h1>What is a Spline?</h1>
      <p>
        By making sure that the different pieces of the piecewise function you construct pass directly through the points you know, and by making sure
        the pieces connect smoothly and continuously, one can easily construct a spline!
      </p>
      <p>
        Continuity means that the pieces connect, and smoothness means that the derivatives match up at those points as well. At the boundaries, you
        are free to use your imagination!
      </p>
      <p>
        Where two spline segments (two pieces of the piecewise polynomial) meet is known as a <b>knot</b>. The samples used to create the spline are
        going to be the knots!
      </p>
    </div>
  );
}

function Card3() {
  return (
    <div className="infoCard-Body">
      <h1>Boundary Conditions</h1>
      <p>
        Splines are constructed by solving systems of linear equations, which means that depending on the degree of the polynomials that you use
        (their highest power), you are going to need lots and lots of equations to solve for all of those coefficients. It is important to note that
        some combinations of parameters result in inconsistent systems of equations that simply cannot be solved for! In those cases, the parameters
        must be adjusted.
      </p>
      <p>
        The equations you get from connecting the pieces and making them smooth are still not enough, and in general for a degree <b>k</b> spline, you
        need <b>k-1</b> more equations. That is where the Boundary Conditions come into play!
      </p>
    </div>
  );
}

function Card4() {
  return (
    <div className="infoCard-Body">
      <h1>Boundary Conditions</h1>
      <p>
        Boundary Conditions are used to specify the values of the derivatives of the spline at the two end points, and depending on what the user
        chooses for those, the resulting spline can vary wildly. There can theoretically be any kind of boundary condition; finding ones that are
        useful is the hard bit.
      </p>
      <div>
        <p className="boundaryDefinition">
          <b>Natural Boundary Conditions</b>: starting with the second highest order derivative possible for the degree of spline chosen, set those
          derivatives equal to 0 at the end points and work your way down.
        </p>
        <p className="boundaryDefinition">
          <b>Clamped Boundary Conditions</b>: starting with the smallest order derivatives first and working your way down, the user can specify the
          exact condition that they want the spline to satisfy and it will be so.
        </p>
        <p className="boundaryDefinition">
          <b>Not-a-Knot</b>: one of the most popular boundary condition types, in which the two spline segments connected by the knot right after the
          first and right before the last are constructed so that even their highest order derivative is the same. Can be mixed with the other two
          types of boundary conditions
        </p>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="infoCard-Body">
      <h1>Specifying Number of Data Points</h1>
      <p>To start using the app, first input the number of data points you would like to use to construct the spline.</p>
      <img className="gif" src={NumPoints} alt="Demonstrating choosing points" />
    </div>
  );
}

function Card6() {
  return (
    <div className="infoCard-Body">
      <h1>Toggling and Choosing a Preset Function</h1>
      <p>Next, you can choose to either input both X and Y values yourself, or perform interpolation on a pre-defined function instead.</p>
      <img className="gif" src={PresetFunction} alt="Demonstrating choosing points" />
    </div>
  );
}

function Card7() {
  return (
    <div className="infoCard-Body">
      <h1>Selecting the Spline's Degree</h1>
      <p>
        You may use the slider to select the degree of spline you would like. I have limited it to degree 10, but theoretically there is no limit to
        the power of the spline!
      </p>
      <img className="gif" src={SplineDegree} alt="Demonstrating choosing points" />
    </div>
  );
}

function Card8() {
  return (
    <div className="infoCard-Body">
      <h1>Filling in the XY Table and Boundary Conditions</h1>
      <p>
        Finally, you may fill in the XY Table and Boundary Condition Tables. If you have enabled a preset function, then the Y values will be filled
        in automatically. Otherwise, you may fill in both X and Y yourself.
      </p>
      <p>
        The Boundary Conditions only require input from you if you selected <b>Clamped</b> or <b>Not-a-Knot + Clamped</b>. The amount of inputs is
        determined by the degree of spline you chose.
      </p>
      <img className="big-gif" src={Tables} alt="Demonstrating choosing points" />
    </div>
  );
}

function Card9() {
  return (
    <div className="infoCard-Body">
      <h1>Spline History and Thank You!</h1>
      <p>
        The word "spline" is an old English word that refers to bent wooden beams used to construct ships and naval vessels! It took mathematics a few
        hundred years after to develop what we see here, when the idea was developed in the late 1940s by Isaac Schoenberg. Splines are a fascinating
        application of Calculus, Linear Algebra, and Numerical Analysis, and have become ubiquitous across many fields.
      </p>

      <p>Thank you for visiting! I hope that you have as much fun noodling around in this app as I had developing it and learning about splines!</p>

      <p>
        On the next page I have included further reading for those who are curious about the applications of splines from computer graphics to
        developing new models of cars.
      </p>
    </div>
  );
}

function Card10() {
  return (
    <div className="infoCard-Body">
      <h1>Further Reading</h1>
      <a href="https://github.com/danmaevsky/Spline-Visualizer/tree/master">
        The GitHub Repo for this project for those interested in seeing the source code
      </a>
      <a href="https://en.wikipedia.org/wiki/Spline_(mathematics)">An Overview of the Mathematical Spline</a>
      <a href="https://en.wikipedia.org/wiki/Flat_spline">An Overview of the Spline as it was used in history</a>
      <a href="https://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve">Bezier Curves</a>
      <a href="https://en.wikipedia.org/wiki/Non-uniform_rational_B-spline">Non-Uniform Rational Basis Splines (NURBS) for Precise 3D Modeling</a>
      <a href="https://ieeexplore.ieee.org/document/8485301">Splines used in Autonomous Vehicles</a>
      <a href="https://www.geeksforgeeks.org/interpolation-methods-in-computer-graphics/">More about Interpolation</a>
    </div>
  );
}
