import "./App.css";
import Routes from "./components/Routes/index";
import Auth from "./pages/Auth";
import { UidContext } from "./components/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { get } from "mongoose";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.action";

function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: get,
        url: "http://localhost:5000/jwtid",
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => console.log("No token"));
    };
    fetchToken();

    if(uid) dispatch(getUser(uid))

    // if(!uid) window.location = "/Auth";
  }, [uid]); // chaque fois que uid evolue, il relance le useEffect

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
}

export default App;
