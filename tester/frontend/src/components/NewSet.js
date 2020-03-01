import React, { useState } from "react";

import Editor from "react-simple-code-editor";

import {
  Container,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";


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
  
  const [editorText, setEditorText] = useState("");

  return (
    <>
      <Container maxWidth="md">
        <Paper className={styles.root}>
          <Typography variant="body1">
            Nová sada otázek
          </Typography>
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
        </Paper>
      </Container>
    </>
  );
}

export default NewSet;