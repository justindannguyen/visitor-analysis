import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import LiveDetection from './components/LiveDetection'
import DetectionDisplay from './components/DetectionDisplay'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} md={8} lg={10}><LiveDetection /></Grid>
        <Grid item xs={12} md={4} lg={2}><DetectionDisplay /></Grid>
      </Grid>
    </div>
  );
}
