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
            <p>
              Vítej na landing pagi
            </p>
            <Link to="/f09a04b6-fcde-4ee6-917f-efc7cd7ab8fb/">f09a04b6-fcde-4ee6-917f-efc7cd7ab8fb</Link>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;