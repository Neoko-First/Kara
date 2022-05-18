import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";

// navigation : association d'url avec l'affichage front de pages différentes
const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Home />} />
        <Route path="/profil" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default index;
