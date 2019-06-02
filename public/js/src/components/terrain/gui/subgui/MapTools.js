import React from 'react';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
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
        margin: '4px 4px 16px 4px'
    },
    type: {
        padding: '8px 0px'
    }
});

class MapTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    assembleControls() {
        const { classes } = this.props;

        this.elev_controls = [];

        let map = this.props.map;

        // setup pass props
        let passes = [];

        for (let p in map.passes) {
            let pass = this.props.passes[map.passes[p]];

            // enabled
            let enabled = (
                <Grid item xs={5} key={`${p}_enabled`}>
                    <InputLabel margin="dense" key={`${p}_enabled_label`}>Enabled</InputLabel>
                    <Checkbox
                        key={`${p}_enabled_input`}
                        checked={pass.params.enabled}
                        onChange={(e) => this.props.updatePassParam(map.passes[p], 'enabled', e.target.checked)}
                    />
                </Grid>
            );

            // render to screen
            let rendertoscreen = (
                <Grid item xs={7} key={`${p}_rendertoscreen`}>
                    <InputLabel margin="dense" key={`${p}_rendertoscreen_label`}>Render To Screen</InputLabel>
                    <Checkbox
                        key={`${p}_rendertoscreen_input`}
                        checked={pass.params.renderToScreen}
                        onChange={(e) => this.props.updatePassParam(map.passes[p], 'renderToScreen', e.target.checked)}
                    />
                </Grid>
            );

            // defines
            let defines = [];
            for (let d in pass.defines) {
                let define = pass.defines[d];
                defines.push(
                    <Grid item xs={6} key={d}>
                        <TextField
                            key={`${d}_input`}
                            label={d}
                            value={Number(define)}
                            type="number"
                            variant="filled"
                            margin="dense"
                            onChange={(e) => this.props.updatePassDefine(map.passes[p], d, e.target.value)}
                        />
                    </Grid>
                );
            }

            // uniforms
            let uniforms = [];
            for (let u in pass.uniforms) {
                let uniform = pass.uniforms[u];

                if (typeof uniform.value != 'object') {
                    uniforms.push(
                        <Grid item xs={6} key={u}>
                            <TextField
                                key={`${u}_input`}
                                label={u}
                                value={Number(uniform.value)}
                                inputProps={{step: 0.1}}
                                type="number"
                                variant="filled"
                                margin="dense"
                                onChange={(e) => this.props.updatePassUniform(map.passes[p], u, e.target.value)}
                            />
                        </Grid>
                    );
                } else {
                    uniforms.push(
                        <Grid item xs={6} key={u}>
                            <TextField
                                key={`${u}_input`}
                                label={u}
                                value={uniform.value.name}
                                type="text"
                                variant="filled"
                                margin="dense"
                            />
                        </Grid>
                    );
                }
            }

            passes.push(
                <ExpansionPanel key={p}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5" className={classes.heading}>{pass.name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container>
                            {enabled}
                            {rendertoscreen}
                            {defines}
                            {uniforms}
                        </Grid>
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        <IconButton disabled size="small"><DeleteIcon /></IconButton>
                        <IconButton disabled size="small"><UpIcon /></IconButton>
                        <IconButton disabled size="small"><DownIcon /></IconButton>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            );
        }
        
        return passes;
    }

    render() {
        const {classes} = this.props;
        let passes = this.assembleControls();

        return (
            <Paper className={classes.root}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Typography className={classes.type} variant="h5">{this.props.map.name}</Typography>
                    </Grid>
                    {passes}
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withRouter(MapTools));