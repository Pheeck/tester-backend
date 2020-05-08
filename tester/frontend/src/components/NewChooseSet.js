import React, { useState } from "react";

import Editor from "react-simple-code-editor";

import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";


const defaultSetName = "Nepojmenovaná vybírací sada";
const defaultText = `//#Biologie
//Co je hlavní funkcí mitochondrie?
//	Dodává buňce energii
//	Chrání buňku před vnějším prostředím
//	Fotosyntetizuje
//	Je logickým centrem buňky
//#
//Kdo napsal Linux kernel?
//	Linus Torvalds
//	Ken Thompson
//	Richard Stallman
//	Dennis Ritchie
//	Andrew S. Tanenbaum
//# Matematika
//Kolik je 2 + 2?
//	4
//	13
//	5
`;


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  editor: {
    backgroundColor: "#fafafa",
  },
}));


function NewChooseSet() {
  const styles = useStyles();

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  const [setName, setSetName] = useState(defaultSetName);
  const [editorText, setEditorText] = useState(defaultText);

  const [created, setCreated] = useState(false);
  const [UUID, setUUID] = useState("");

  function createSet() {
    var formData = new FormData();
    formData.append("name", setName);
    formData.append("choose", true);
    formData.append("text", editorText);

    fetch(
      "/api/set/create-from-text/",
      {
        method: "POST",
        body: formData
      }
    ).then((response) => {
      if (response.status !== 200) {
        response.text().then((text) => {
          setErrorText(text);
          setErrorOpen(true);
        });
      }
      else {
        response.json().then((data) => {
          setUUID(data["UUID"]);
          setCreated(true);
        });
      }
    });
  }


  return (
    <>
      <Dialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
      >
        <DialogTitle>Chyba</DialogTitle>
        <Typography variant="body1">
          {errorText}
        </Typography>
      </Dialog>
      <Container maxWidth="md">
        <Paper className={styles.root}>
          <Grid container spacing={3}>
            {
              created
                ? <Grid item sm={12}>
                    <Typography variant="body1">
                      Vybírací sada '{setName}' vytvořena
                    </Typography>
                    <Typography variant="body1">
                      Kód sady: {UUID}
                    </Typography>
                    <Typography>
                      Kód si zapište. Pomocí něho budete k sadě přistupovat.
                    </Typography>
                  </Grid>
                : <>
                    <Grid item sm={4}>
                      <Typography variant="body1">
                        Nová vybírací sada otázek
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body1">
                        Odpovědi pište na řádky pod otázky a uveďte je tabulátorem
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body1">
                        Odpověď na prvním řádku pod otázkou bude považována za správnou
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body1">
                        Řádky uvedené dvěmi lomítky '//' budou ignorovány
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body1">
                        Řádky uvedenými hashem '#' lze označit začátek kategorie
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body1">
                        Kategorii ukončuje další řádek označený hashem -
                        ten může začínat novou kategorii nebo být prázdný
                      </Typography>
                    </Grid>
                    <Grid item sm={12}>
                      <TextField
                        label="Název sady"
                        value={setName}
                        onChange={(event) => setSetName(event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Editor
                        value={editorText}
                        onValueChange={(newText) => setEditorText(newText)}
                        highlight={(newText) => newText}
                        padding={10}
                        tabSize={1}
                        insertSpaces={false}
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                        className={styles.editor}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={createSet}
                      >
                        Dokončit vytváření sady
                      </Button>
                    </Grid>
                  </>
            }
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default NewChooseSet;