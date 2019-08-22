import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class BoolInput extends React.Component {
    static defaultProps = {
        name: "Value"
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
        this.setState(state => (state.value = e.target.checked));
        this.props.onChange(this.state.value);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={12} align="right">
                <InputLabel margin="dense">{this.props.name}</InputLabel>
                <Checkbox
                    checked={this.state.value}
                    onChange={(e) => this.handleChange(e)}
                />
            </Grid>            
        );
    }
}

export default withStyles(styles)(BoolInput);