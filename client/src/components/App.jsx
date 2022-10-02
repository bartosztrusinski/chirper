import "../styles/index.scss";
import Recipes from "./Recipes";
import rx7 from "../images/rx7.jpg";

function App() {
  return (
    <>
      <header>
        <h1> Hello React ⚛️</h1>
        <img src={rx7} alt="Mazda RX7" width="150" />
      </header>
      <Recipes />
    </>
  );
}

export default App;
