import "./Navbar.css";
import logo from "../../logo.svg";
import HelpButton from "./HelpButton";

export default function Navbar(props) {
  return (
    <div className="navbar">
      <img className="logo" src={logo} alt="logo" />
      <h1>Spline Visualizer</h1>
      <HelpButton setShowCards={props.setShowCards} />
    </div>
  );
}
