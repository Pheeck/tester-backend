import React, {useState} from 'react';

import {
  Button,
  Container,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  TextField,
  makeStyles,
} from '@material-ui/core';

import DataProvider from "./DataProvider";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));


function FinishComp({ setTestRunning }) {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='body1'>
            Test dokončen
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => setTestRunning(false)}
          >
            Opakovat
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

function TestingComp({ test, setTestRunning }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [testDone, setTestDone] = useState(false);

  function toggleExpanded() {
    setButtonsDisabled(!buttonsDisabled);
    setPanelExpanded(!panelExpanded);
  }

  function nextQuestion(success) {
    // Amend question priority
    if (success) {
      // Finish test if no questions remain
      if (test.length == 1 && test[qIndex].priority == 1) {
        setTestDone(true);
        return;
      }
      test[qIndex].priority -= 1;
    }
    else {
      test[qIndex].priority += 1;
    }
    
    // Delete question if priority 0, set new question index
    var newQIndex = qIndex;
    if (test[qIndex].priority == 0) {
      test.splice(qIndex, 1);
    }
    else {
      newQIndex += 1;
    }
    newQIndex %= test.length;
    setQIndex(newQIndex);

    // Prepare GUI for new question
    toggleExpanded();
  }

  return (
    <>
      {
        testDone
        ? <FinishComp setTestRunning={setTestRunning} />
        : <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant='body1'>32 zbývá ({qIndex})</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>z toho tato otázka {test[qIndex].priority}x</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                disabled={buttonsDisabled}
                onClick={() => nextQuestion(true)}
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
                onClick={() => nextQuestion(false)}
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
                    {test[qIndex] === undefined ? 'no test loaded' : test[qIndex].question}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography variant='body1'>
                    {test[qIndex] === undefined ? 'no test loaded' : test[qIndex].answer}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
      }
    </>
  );
}

function StartComp({ data }) {
  const [test, setTest] = useState([]);
  const [testRunning, setTestRunning] = useState(false);

  const [qPriority, setQPriority] = useState(2);
  const [inversedMode, setInversedMode] = useState(false);

  function generateTest() {
    var result = [];

    data.forEach((question) => {
      result.push({
        question: inversedMode ? question.answer : question.question,
        answer: inversedMode ? question.question : question.answer,
        priority: qPriority
      });
    });

    setTest(result);
  }

  function startTest() {
    generateTest();
    setTestRunning(true);
  }

  return (
    <>
      {
        testRunning
          ? <TestingComp test={test} setTestRunning={setTestRunning}/>
          : <Grid container spacing={3}>
              <Grid item xs={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={inversedMode}
                      onChange={(event) => setInversedMode(event.target.checked)}
                    />
                  }
                  label="Převrátit otázky"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  id="standard-number"
                  label="Opakovat otázky"
                  type="number"
                  value={qPriority}
                  onChange={(event) => setQPriority(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  onClick={startTest}
                >
                  Spustit test
                </Button>
              </Grid>
            </Grid>
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