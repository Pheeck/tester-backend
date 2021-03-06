import React, {useState} from "react";
import ReactDOM from "react-dom";

import Tester from "./Tester";
import NewStandardSet from "./NewStandardSet";
import NewChooseSet from "./NewChooseSet";

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
  var { UUID } = useParams();

  return (
    <Tester UUID={UUID}/>
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
  const [UUIDError, setUUIDError] = useState(false);

  const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  function checkUUID() {
    return UUIDRegex.test(setUUID);
  }

  return (
    <>
      <Container maxWidth="xs">
        <Grid container spacing={3}>
          <Card>
            <Grid item xs={12}>
              <Typography variant="body1">
                Vítej na hlavní stránce Testeru
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
              {
                UUIDError
                  ? <TextField
                      label="Zadej kód"
                      value={setUUID}
                      onChange={(event) => setSetUUID(event.target.value)}
                      fullWidth

                      error
                      helperText="Toto není validní kód"
                    />
                  : <TextField
                      label="Zadej kód"
                      value={setUUID}
                      onChange={(event) => setSetUUID(event.target.value)}
                      fullWidth
                    />
              }
            </Grid>
            <Grid item xs={12}>
              <Link to={() => checkUUID() ? "/" + setUUID + "/" : ""}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    if (!checkUUID()) {
                      setUUIDError(true);
                    }
                  }}
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
              <Link to="/create-standard">
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Nová standardní sada
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/create-choose">
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Nová vybírací sada
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
          <Route path="/create-standard">
            <Link to="/">
              <Button
                variant="contained"
              >
                Zpět na hlavní stránku
              </Button>
            </Link>
            <NewStandardSet />
          </Route>
          <Route path="/create-choose">
            <Link to="/">
              <Button
                variant="contained"
              >
                Zpět na hlavní stránku
              </Button>
            </Link>
            <NewChooseSet />
          </Route>
          <Route path="/:UUID">
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