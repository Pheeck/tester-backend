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


function TestingComp({ test }) {
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
        ? <Typography variant='body1'>
            Test dokončen
          </Typography>
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

function StartComp({ data, priority }) {
  const [test, setTest] = useState([]);
  const [testStarted, setTestStarted] = useState(false);

  function generateTest() {
    var result = [];

    data.forEach((question) => {
      result.push({
        question: question.question,
        answer: question.answer,
        priority: priority
      });
    });

    setTest(result);
  }

  function startTest() {
    generateTest();
    setTestStarted(true);
  }

  return (
    <>
      {
        testStarted
          ? <TestingComp test={test}/>
          : <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={startTest}
            >
              Spustit test
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
          <DataProvider endpoint="api/questions/" render={data => <StartComp data={data} priority={2} />} />
        </Paper>
      </Container>
    </>
  );
}

export default Tester;