import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import InfoCards from "./components/InfoCards/InfoCards";
import GraphContainer from "./components/GraphContainer/GraphContainer";
import { useState, useEffect } from "react";
import useToggle from "./hooks/useToggle";

function App() {
  const [showCards, setShowCards] = useState(true);

  return (
    <div className="App">
      <Navbar setShowCards={setShowCards} />
      <GraphContainer />
      {showCards ? <InfoCards setShowCards={setShowCards} /> : null}
    </div>
  );
}

export default App;
