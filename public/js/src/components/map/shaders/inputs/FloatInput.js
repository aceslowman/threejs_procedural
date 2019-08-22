import React from 'react';
import { Divider } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteIcon from '@material-ui/icons/Delete';


const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class FloatInput extends React.Component {
    static defaultProps = {
        stepSize: 0.1,
        name: "value"
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.value
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.value != this.state.value) {
            this.props.onChange(this.state.value);
        }
    }

    handleChange(e) {
        e.persist();
        this.setState(state => (state.value = e.target.value));
        this.props.onChange(this.state.value);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container alignItems="center">
                <Grid item xs={12}>
                    <TextField
                        label={this.props.name}
                        value={this.state.value}
                        inputProps={{ step: this.props.stepSize }}
                        type="number"
                        variant="filled"
                        margin="dense"
                        onChange={(e) => this.handleChange(e)}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(FloatInput);