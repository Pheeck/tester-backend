import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";
import Tester from "./Tester";
import Button from '@material-ui/core/Button';

function App() {
  return (
    <>
      <DataProvider endpoint="api/questions/" render={data => <Table data={data} />} />
      <DataProvider endpoint="api/questions/" render={data => <Tester data={data} />} />
      <Button>Ahoj</Button>
    </>
  );
}

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;