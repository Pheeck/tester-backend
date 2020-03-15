import React, {useState} from "react";
import ReactDOM from "react-dom";

import Tester from "./Tester";
import NewSet from "./NewSet";
import UploadSet from "./UploadSet";

import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
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

function Card(props) {
  var styles = useStyles();

  return (
    <Grid item xs={12}>
      <Paper className={styles.root}>
        <Grid container spacing={3}>
          {props.children}
        </Grid>
      </Paper>
    </Grid>
);
}

function MainPage() {
  var styles = useStyles();

  const [setUUID, setSetUUID] = useState("");

  return (
    <>
      <Container maxWidth="xs">
        <Grid container spacing={3}>
          <Card>
            <Grid item xs={12}>
              <Typography variant="body1">
                Vítej na hlavní stránce
              </Typography>
            </Grid>
          </Card>
          <Card>
            <Grid item xs={12}>
              <Typography variant="body1">
                Mám kód sady otázek
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Zadej kód"
                value={setUUID}
                onChange={(event) => setSetUUID(event.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Link to={() => "/" + setUUID + "/"}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Načíst sadu
                </Button>
              </Link>
            </Grid>
          </Card>
          <Card>
            <Grid item xs={12}>
              <Typography variant="body1">
                Chci vytvořit novou sadu otázek
              </Typography>
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
                  Nahrát soubor (nefunkční)
                </Button>
              </Link>
            </Grid>
          </Card>
        </Grid>
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