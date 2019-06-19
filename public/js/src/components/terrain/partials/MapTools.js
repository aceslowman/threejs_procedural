import React from 'react';
import { withRouter } from 'react-router-dom';

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
        padding: '16px !important',
        margin: '4px 4px 16px 4px',
        border: '1px solid rgba(255, 255, 255, 0.12);'
    },
    highlighted: {
        border: '1px solid rgba(255,255,255,0.6)'
    },
    type: {
        padding: '8px 0px'
    }
});

class MapTools extends React.Component {
    constructor(props) {
        super(props);

        this.passes = [];

        this.state = {
            selected: false
        }
    }
    
    render() {
        const {classes} = this.props;

        return (
            <Paper className={`${classes.root} ${this.props.selected ? classes.highlighted : ''}`} ref={mount => { this.mount = mount }} onClick={() => this.handleClick()}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Typography className={classes.type} variant="h5">{this.props.map.name}</Typography>
                    </Grid>
                    {this.props.children}
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withRouter(MapTools));