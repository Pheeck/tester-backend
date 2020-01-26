import React, {useState} from 'react';

import {
  Button,
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';

import DataProvider from "./DataProvider";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));


function TestingComp({ data }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [repeats, setRepeats] = useState([]);

  function toggleExpanded() {
    setButtonsDisabled(!buttonsDisabled);
    setPanelExpanded(!panelExpanded);
  }

  function nextQuestion() {
    setQIndex((qIndex + 1) % data.length);
    toggleExpanded();
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant='body1'>32 zbývá ({qIndex})</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body1'>z toho tato otázka 3x</Typography>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            disabled={buttonsDisabled}
            onClick={nextQuestion}
          >
            Vím
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            disabled={buttonsDisabled}
            onClick={nextQuestion}
          >
            Nevím
          </Button>
        </Grid>

        <Grid item xs={12}>
          <ExpansionPanel
            expanded={panelExpanded}
            onChange={toggleExpanded}
            TransitionProps={{
              'timeout': {'exit': 0},
            }}
          >
            <ExpansionPanelSummary>
              <Typography variant='body1'>
                {data[qIndex] === undefined ? 'no data' : data[qIndex].question}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography variant='body1'>
                {data[qIndex] === undefined ? 'no data' : data[qIndex].answer}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </>
  );
}

function StartComp({ data, priority }) {
  const [testStarted, setTestStarted] = useState(false);

  function generateTest() {
    test = [];

    // Array s objekty {question, answer, priority}

    return test;
  }

  return (
    <>
      {
        testStarted
          ? <TestingComp data={data}/>
          : <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => setTestStarted(true)}
            >
              Start test
            </Button>
      }
    </>
  );
}

function Tester() {
  const styles = useStyles();

  return (
    <>
      <Container maxWidth='xs'>
        <Paper className={styles.root}>
          <DataProvider endpoint="api/questions/" render={data => <StartComp data={data} />} />
        </Paper>
      </Container>
    </>
  );
}

export default Tester;