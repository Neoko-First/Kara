import React from "react";
import Header from "../components/Header";
import Routes from "../routes";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <>
      <Header />
      <Routes />
      <Footer />
    </>
  );
}
