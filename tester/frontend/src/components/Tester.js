// NOTICE: The word 'set' is used two ways in this file:
// 1) As an identifier for state setting functions
// 2) As a name for sets of questions and related variables

import React, {useState, useEffect} from "react";

import {
  Button,
  Container,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  makeStyles,
} from "@material-ui/core";

import DataProvider from "./DataProvider";


function shuffle(array) {  // Utility function
  // Uses Fisher-Yates shuffle
  var j, foo;
  for (var i = 0; i < array.length - 1; ++i) {
    j = i + Math.floor(Math.random() * (array.length - i));
    foo = array[i];
    array[i] = array[j];
    array[j] = foo;
  }
}


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
        finishTest(qAnswered + 1, success ? qSuccesses + 1 : qSuccesses);
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

  function finishTest(answ, succ) {  // Answered and succeses must be counted separately, because the component atributes may not be updated yet
    // Send results to backend
    var formData = new FormData();
    formData.append("answered", answ);
    formData.append("successes", succ);
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

function TestingChooseComp({test, setName, UUID, qRemaining, setQRemaining, setTestRunning, qAnswered, setQAnswered, qSuccesses, setQSuccesses }) {
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [answerButtons, setAnswerButtons] = useState([]);

  const [qIndex, setQIndex] = useState(0);
  const [testDone, setTestDone] = useState(false);

  const [totalSuccessRate, setTotalSuccessRate] = useState(0.0);


  //useEffect(() => {  TODO
  //  shuffleAnswers();
  //}, []);  // Will only trigger when component first renders

  useEffect(() => {
    generateButtons();
  }, [answerRevealed]);  // Will only trigger on first render and when 'answerRevealed' state changes


  function shuffleAnswers() {
    shuffle(test[qIndex].answers);
  }

  function generateButtons() {
    var result = [];

    test[qIndex].answers.forEach((answer, index) => {
      result.push(  // Each child in a list should have a unique "key" prop.
        <Grid item xs={12} key={index}>
          {
            answerRevealed
            ? <Button
                variant="contained"
                color={"primary"}
                fullWidth
                disabled={!answer.correct}
                onClick={nextQuestion}
              >
                {answer.answer}
              </Button>
            : <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={answerRevealed}
                onClick={() => {revealAnswer(answer.correct)}}
              >
                {answer.answer}
              </Button>
          }
        </Grid>
      )
    });

    setAnswerButtons(result);
  }

  function revealAnswer(success) {
    // Update 'answered' and 'successes'
    setQAnswered(qAnswered + 1);
    if (success) {
      setQSuccesses(qSuccesses + 1);
    }

    // Amend question priority
    if (success) {
      test[qIndex].priority -= 1;
      setQRemaining(qRemaining - 1);
    }
    else {
      test[qIndex].priority += 1;
      setQRemaining(qRemaining + 1);
    }

    setAnswerRevealed(true);
  }

  function nextQuestion() {
    // Finish test if no questions remain
    if (qRemaining <= 0) {
      finishTest();
      return;
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

    shuffleAnswers();

    // Prepare GUI for new question
    setAnswerRevealed(false);
    generateButtons();
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
            <Grid item xs={12}>
              <Typography variant="body1">{test[qIndex].question}</Typography>
            </Grid>
            <>
              {answerButtons}
            </>
          </Grid>
      }
    </>
  );
}

function StartComp({ set, setName, setSize, UUID, isChooseSet }) {
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
    var result = [];

    set.forEach((question) => {
      if (isChooseSet) {  // Each type of set (standard, choose-from-multiple) requires different data
        shuffle(question.answers);  // First, shuffle the answers
        result.push({
          question: question.question,
          answers: question.answers,  // Answers are objects {string answer, bool correct}
          category: question.category,
          priority: qPriority
        });
      }
      else {
        var answer = question.answers[0].answer;  // Answer is a string

        result.push({
          question: inversedMode ? answer : question.question,
          answer: inversedMode ? question.question : answer,
          category: question.category,
          priority: qPriority
        });
      }
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
          ? isChooseSet
              ? <TestingChooseComp
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
              : <TestingComp
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
              <Grid item xs={12}>
                <Typography variant="body1">
                  {isChooseSet ? "Vybírací sada" : "Standardní sada"}
                </Typography>
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
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Opakovat otázky</InputLabel>
                  <Select
                    labelId="priority-label"
                    value={qPriority}
                    onChange={handlePriorityChange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {
                isChooseSet
                ? <></>
                : <Grid item xs={7}>
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
              }
              <Grid item xs={isChooseSet ? 12 : 5}>
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


function ErrorComp({ UUID }) {
  return (
    <>
      <Typography variant="body1">
        Nastala chyba při načítání sady {UUID}
      </Typography>
      <Typography variant="body1">
        Máte správný kód?
      </Typography>
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
            render={data => {
              if (data === undefined) {
                return <ErrorComp UUID={UUID}/>;
              }
              else {
                return <StartComp set={data.questions} setName={data.name} setSize={data.size} isChooseSet={data.choose} UUID={UUID}/>;
              }
            }}
          />
        </Paper>
      </Container>
    </>
  );
}

export default Tester;