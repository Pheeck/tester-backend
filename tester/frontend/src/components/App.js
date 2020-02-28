import React from "react";
import ReactDOM from "react-dom";
import Tester from "./Tester";

import {
  Switch,
  Route,
  Link,
  BrowserRouter,
  useParams
} from "react-router-dom";


function Child() {
  var { id } = useParams();

  return (
    <Tester setId={id}/>
  );
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/:id">
            <Child />
          </Route>
          <Route path="/">
            <Link to="/ahoj/">Test</Link>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;