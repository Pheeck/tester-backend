import React from "react";
import ReactDOM from "react-dom";

import Tester from "./Tester";
import NewSet from "./NewSet";
import UploadSet from "./UploadSet";

import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";

import {
  Switch,
  Route,
  Link,
  BrowserRouter,
  useParams
} from "react-router-dom";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));


function Child() {
  var { id } = useParams();

  return (
    <Tester setId={id}/>
  );
}

function MainPage() {
  var styles = useStyles();

  return (
    <>
      <Container maxWidth="xs">
        <Paper className={styles.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1">
                Vítej na hlavní stránce
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Link to="/007bf0bc-ce10-46c4-93ca-86f969898ca0/">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  007bf0bc-ce10-46c4-93ca-86f969898ca0
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/create/">
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Nová sada
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/upload/">
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Nahrát soubor
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/create">
            <Link to="/">
              <Button
                variant="contained"
              >
                Zpět na hlavní stránku
              </Button>
            </Link>
            <NewSet />
          </Route>
          <Route path="/upload">
            <Link to="/">
              <Button
                variant="contained"
              >
                Zpět na hlavní stránku
              </Button>
            </Link>
            <UploadSet />
          </Route>
          <Route path="/:id">
            <Link to="/">
              <Button
                variant="contained"
              >
                Zpět na hlavní stránku
              </Button>
            </Link>
            <Child />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;