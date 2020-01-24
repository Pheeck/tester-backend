import React from "react";
import ReactDOM from "react-dom";
import Tester from "./Tester";

function App() {
  return (
    <>
      <Tester />
    </>
  );
}

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;