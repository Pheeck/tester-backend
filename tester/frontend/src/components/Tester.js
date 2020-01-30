import React, {useState} from "react";

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
} from "@material-ui/core";

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
          <Typography variant="body1">
            Test dokončen
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
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

function TestingComp({ test, qRemaining, setQRemaining, setTestRunning }) {
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
      if (qRemaining <= 1) {
        setTestDone(true);
        return;
      }
      test[qIndex].priority -= 1;
      setQRemaining(qRemaining - 1);
    }
    else {
      test[qIndex].priority += 1;
      setQRemaining(qRemaining + 1);
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
              <Typography variant="body1">zbývá {qRemaining} otázek</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">z toho tato otázka {test[qIndex].priority}x</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={buttonsDisabled}
                onClick={() => nextQuestion(true)}
              >
                Vím
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
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
                  "timeout": {"exit": 0},
                }}
              >
                <ExpansionPanelSummary>
                  <Typography variant="body1">
                    {test[qIndex] === undefined ? "test nebyl načten" : test[qIndex].question}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography variant="body1">
                    {test[qIndex] === undefined ? "test nebyl načten" : test[qIndex].answer}
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
  const [qRemaining, setQRemaining] = useState(0);

  const [qPriority, setQPriority] = useState(2);
  const [inversedMode, setInversedMode] = useState(false);

  const minPriority = 1;
  const maxPriority = 9;

  function handlePriorityChange(event) {
    function isValidPriority(priority) {
      // Test if priority is a number, is within defined limits and is an integer
      return Number(priority) === priority && minPriority <= priority <= maxPriority && priority % 1 === 0;
    }
    var newPriority = event.taget.value;
    if (isValidPriority(newPriority)) {
      setQPriority(newPriority);
    }
  }

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
    setQRemaining(result.length * qPriority);
  }

  function startTest() {
    generateTest();
    setTestRunning(true);
  }

  return (
    <>
      {
        testRunning
          ? <TestingComp
              test={test}
              qRemaining={qRemaining}
              setQRemaining={setQRemaining}
              setTestRunning={setTestRunning}
            />
          : <Grid container spacing={3}>
              <Grid item xs={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={inversedMode}
                      onChange={handlePriorityChange}
                    />
                  }
                  label="Převrátit otázky"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Opakovat otázky"
                  type="number"
                  value={qPriority}
                  onChange={(event) => setQPriority(event.target.value)}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 9
                    }}
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
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
      <Container maxWidth="xs">
        <Paper className={styles.root}>
          <DataProvider endpoint="api/questions/" render={data => <StartComp data={data} />} />
        </Paper>
      </Container>
    </>
  );
}

export default Tester;