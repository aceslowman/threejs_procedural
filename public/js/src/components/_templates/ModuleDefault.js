import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SketchContext from "../../SketchContext";
import { Divider } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class MODULE extends React.Component {
    static contextType = SketchContext;

    static defaultProps = {

    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid
                    container
                    justify={'space-around'}
                    alignItems={'center'}
                    spacing={16}
                >
                    <Typography variant="h5" gutterBottom>MODULE</Typography>
                </Grid>
                <Divider />
            </Paper>
        );
    }
}

export default withStyles(styles)(MODULE);