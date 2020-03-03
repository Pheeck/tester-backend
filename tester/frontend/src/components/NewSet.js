import React, { useState } from "react";

import Editor from "react-simple-code-editor";

import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";


const defaultSetName = "Nepojmenovaná sada";
const defaultText = `//#Biologie
//Co je hlavní funkcí mitochondrie?
//	Je silovým domem cely
//#
//Kdo napsal Linux?
//	I would like to interject for a moment...
`;


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  editor: {
    backgroundColor: "#fafafa",
  },
}));


function NewSet() {
  const styles = useStyles();
  
  const [setName, setSetName] = useState(defaultSetName);
  const [editorText, setEditorText] = useState(defaultText);

  const [created, setCreated] = useState(false);
  const [UUID, setUUID] = useState("");


  function createSet() {
    var formData = new FormData();
    formData.append("name", setName);
    formData.append("text", editorText);

    fetch(
      "/api/set/create-from-text/",
      {
        method: "POST",
        body: formData
      }
    ).then((response) => response.json().then((data) => {
      setUUID(data["UUID"]);
      setCreated(true);
    }));
  } 


  return (
    <>
      <Container maxWidth="md">
        <Paper className={styles.root}>
          <Grid container spacing={3}>
            {
              created
                ? <Grid item sm={12}>
                    <Typography variant="body1">
                      Sada {UUID} vytvořena
                    </Typography>
                  </Grid>
                : <>
                    <Grid item sm={4}>
                      <Typography variant="body1">
                        Nová sada otázek
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

export default NewSet;