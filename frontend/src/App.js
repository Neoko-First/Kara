import Header from "./components/molecules/Header";
import Routes from "./routes/index.js";
import Footer from "./components/molecules/Footer";
import "./styles/index.scss";

export default function App() {
  return (
    <>
      <Header />
      <Routes />
      <Footer />
    </>
  );
}
