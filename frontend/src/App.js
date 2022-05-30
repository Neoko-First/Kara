import './App.css';
import Routes from "./components/Routes/index";
import LoadingScreen from "./components/Loading/LoadingScreen";

function App() {
  return (
    <div className="App">
      {/* <LoadingScreen/> */}
      <Routes />
    </div>
  );
}

export default App;
