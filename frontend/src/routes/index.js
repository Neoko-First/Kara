import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "../pages/NoPage";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Social from "../pages/Social";
import Conversation from "../pages/Conversation";
import Settings from "../pages/Settings";
import Authentification from "../pages/Authentification";

export default function index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Authentification />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/social" element={<Social />} />
          <Route path="/chat" element={<Conversation />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
