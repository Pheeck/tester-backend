// NOTICE: The word 'set' is used two ways in this file:
// 1) As an identifier for state setting functions
// 2) As a name for sets of questions and related variables

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


function FinishComp({ setTestRunning, qAnswered, qSuccesses, totalSuccessRate }) {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1">
            Test dokončen
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Zodpovězeno:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Správně:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {qAnswered} otázek
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {qSuccesses} otázek
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Úspěšnost:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Globální úspěšnost:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {Math.round(qSuccesses / qAnswered * 100)}%
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {
              totalSuccessRate == 0
              ? "Načítám..."
              : totalSuccessRate + "%"
            }
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

function TestingComp({test, setName, UUID, qRemaining, setQRemaining, setTestRunning, qAnswered, setQAnswered, qSuccesses, setQSuccesses }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [testDone, setTestDone] = useState(false);

  const [totalSuccessRate, setTotalSuccessRate] = useState(0.0);

  function toggleExpanded() {
    setButtonsDisabled(!buttonsDisabled);
    setPanelExpanded(!panelExpanded);
  }

  function nextQuestion(success) {
    // Update 'answered' and 'successes'
    setQAnswered(qAnswered + 1);
    if (success) {
      setQSuccesses(qSuccesses + 1);
    }

    // Amend question priority
    if (success) {
      // Finish test if no questions remain
      if (qRemaining <= 1) {
        finishTest();
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

  function finishTest() {
    // Send results to backend
    var formData = new FormData();
    formData.append("answered", qAnswered);
    formData.append("successes", qSuccesses);
    formData.append("set", UUID);

    fetch(
      "/api/result/create/",
      {
        method: "POST",
        body: formData
      }
    ).then((response) => response.json().then((data) => {
      setTotalSuccessRate(Math.round(data["totalSuccesses"] / data["totalAnswered"] * 100));
    }));

    // Frontend
    setTestDone(true);
  }

  return (
    <>
      {
        testDone
        ? <FinishComp
            setTestRunning={setTestRunning}
            qAnswered={qAnswered}
            qSuccesses={qSuccesses}
            totalSuccessRate={totalSuccessRate}
          />
        : <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1">Sada otázek: {setName}</Typography>
            </Grid>
            <Grid item xs={12}>
              {
                test[qIndex].category !== ""
                ? 
                  <Typography variant="body1">Kategorie: {test[qIndex].category}</Typography>
                : <Typography variant="body1">Bez kategorie</Typography>
              }
            </Grid>
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

function StartComp({ set, setName, UUID, setSize }) {
  const [test, setTest] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const [qRemaining, setQRemaining] = useState(0);

  const [qAnswered, setQAnswered] = useState(0);
  const [qSuccesses, setQSuccesses] = useState(0);

  const [qPriority, setQPriority] = useState(2);
  const [inversedMode, setInversedMode] = useState(false);
  const [randomMode, setRandomMode] = useState(false);

  const minPriority = 1;
  const maxPriority = 9;

  function handlePriorityChange(event) {
    // Test if new priority is a number, is within defined limits and is an integer
    var newPriority = event.target.value;
    if (isNaN(newPriority)) {
      return;
    }
    newPriority = Number(newPriority);
    if (newPriority < minPriority || newPriority > maxPriority) {
      return;
    }
    if (newPriority % 1 !== 0) {
      return;
    }
    // If everything in order, set question priority
    setQPriority(newPriority);
  }

  function generateTest() {
    function shuffle(array) {
      // Uses Fisher-Yates shuffle
      var j, foo;
      for (var i = 0; i < array.length - 1; ++i) {
        j = i + Math.floor(Math.random() * (array.length - i));
        foo = array[i];
        array[i] = array[j];
        array[j] = foo;
      }
    }

    var result = [];

    set.forEach((question) => {
      result.push({
        question: inversedMode ? question.answer : question.question,
        answer: inversedMode ? question.question : question.answer,
        category: question.category,
        priority: qPriority
      });
    });

    if (randomMode) {
      shuffle(result);
    }

    setTest(result);
    // setQRemaining(result.length * qPriority);
    setQRemaining(setSize * qPriority);
  }

  function startTest() {
    generateTest();

    setQAnswered(0);
    setQSuccesses(0);

    setTestRunning(true);
  }

  return (
    <>
      {
        testRunning
          ? <TestingComp
              test={test}

              setName={setName}
              UUID={UUID}

              qRemaining={qRemaining}
              setQRemaining={setQRemaining}

              setTestRunning={setTestRunning}

              qAnswered={qAnswered}
              setQAnswered={setQAnswered}
              qSuccesses={qSuccesses}
              setQSuccesses={setQSuccesses}
            />
          : <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Sada otázek: {setName}
                </Typography>
              </Grid>
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
                  label="Opakovat otázky"
                  type="number"
                  value={qPriority}
                  onChange={handlePriorityChange}
                />
              </Grid>
              <Grid item xs={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={randomMode}
                      onChange={(event) => setRandomMode(event.target.checked)}
                    />
                  }
                  label="Náhodné pořadí"
                />
              </Grid>
              <Grid item xs={5}>
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

function Tester({ UUID }) {
  const styles = useStyles();

  return (
    <>
      <Container maxWidth="xs">
        <Paper className={styles.root}>
          <DataProvider
            endpoint={"/api/set/retrieve-by-uuid/" + UUID + "/"}
            render={data => <StartComp set={data.questions} setName={data.name} UUID={UUID} setSize={data.size} />}
          />
        </Paper>
      </Container>
    </>
  );
}

export default Tester;