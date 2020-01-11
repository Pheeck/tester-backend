import React, {useState} from 'react';
//import './App.css';

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

//import 'typeface-roboto';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Tester(data) {
  const styles = useStyles();

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
    <Container maxWidth='xs'>
      <Paper className={styles.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant='body1'>32 zbývá</Typography>
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
                  {typeof data[qIndex] == 'undefined' ? '' : data[qIndex].question}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography variant='body1'>
                  {typeof data[qIndex] == 'undefined' ? '' : data[qIndex].answer}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Tester;