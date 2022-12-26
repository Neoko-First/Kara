import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Socials from "../pages/Socials";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Auth from "../pages/Auth";

export default function index() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}
