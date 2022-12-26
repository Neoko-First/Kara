import "./styles/index.scss";
import { UidContext } from "./components/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.action";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "GET",
        url: "http://localhost:5000/jwtid",
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => {
          console.log("No token");
        });
    };
    fetchToken();

    if (uid) dispatch(getUser(uid));

    // if(!uid) window.location = "/Auth";
  }, [dispatch, uid]); // chaque fois que uid evolue, il relance le useEffect

  return (
    <UidContext.Provider value={uid}>
      <AppLayout />
    </UidContext.Provider>
  );
}
