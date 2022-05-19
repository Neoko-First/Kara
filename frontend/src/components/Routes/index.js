import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Profile from "../../pages/Profile";
import Socials from "../../pages/Socials";

// navigation : association d'url avec l'affichage front de pages différentes
const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Socials" element={<Socials />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default index;
