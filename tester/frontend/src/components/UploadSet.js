import React from "react";

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
}));


function UploadSet() {
    const styles = useStyles();
  
    return (
      <>
        <Container maxWidth="xs">
          <Paper className={styles.root}>
            <Typography variant="body1">
                Nahrát sadu otázek
            </Typography>
          </Paper>
        </Container>
      </>
    );
  }
  
  export default UploadSet;