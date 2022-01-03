import "./Navbar.css";

export default function HelpButton(props) {
  const { setShowCards } = props;
  return (
    <div
      className="helpButton"
      onClick={() => {
        setShowCards(true);
      }}
    >
      ?
    </div>
  );
}
