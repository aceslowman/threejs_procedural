import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

// TODO: implement scalar

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class VectorInput extends React.Component {
    static defaultProps = {
        stepSize: 0.1,
        labels: ['x','y','z','w']
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.value
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.value != this.state.value){
            this.props.onChange(this.state.value);
        }
    }

    handleChange(e,i){
        e.persist();
        this.setState(state => (state.value[i] = e.target.value));
        this.props.onChange(this.state.value);
    }

    render() {
        const { classes } = this.props;

        let elements = [];
        let elem_size = Math.floor(12 / (this.props.size + 1)); 

        for(let i = 0; i < this.props.size; i++){
            elements.push(
                <Grid item xs={elem_size} key={i}>
                    <TextField
                        label={this.props.labels[i]}
                        value={this.state.value[i]}
                        inputProps={{ step: this.props.stepSize }}
                        type="number"
                        variant="filled"
                        margin="dense"
                        onChange={(e) => this.handleChange(e, i)}
                    />
                </Grid>
            );
        }

        return (
            < Grid container alignItems = "center" >

                <Grid item xs={3} align="center">
                    <InputLabel margin="dense">{this.props.name}</InputLabel>
                </Grid>

                {elements}
            </Grid >
        );
    }
}

export default withStyles(styles)(VectorInput);