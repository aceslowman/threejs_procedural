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

    handleClick(){
        this.props.selectMap(this.props.map);
    }

    handlePassSelect(id) {
        this.props.selectPass(id);
    }

    componentWillMount() { this.assembleControls() }

    componentDidUpdate() { this.assembleControls() }

    updatePassParam(pass_id, name, value) {
        console.log('updatePassParam', [pass_id, name, value]);

        // this.props.map.composer.passes[pass_id][name]
    }

    updatePassDefine(pass_id, name, value) {
        console.log('updatePassDefine', [pass_id, name, value]);

        // this.props.map.composer.passes[pass_id].defines
    }
    
    updatePassUniform(pass_id, name, value) {
        console.log('updatePassUniform', [pass_id, name, value]);

        // this.props.map.composer.passes[pass_id].uniforms[name].value = value;
    }

    assembleControls() {
        const { classes } = this.props;

        this.elev_controls = [];

        let map = this.props.map;

        // setup pass props
        let passes = [];

        for (let p in map.composer.passes) {
            let pass = map.composer.passes[p];
            
            let enabled = (
                <Grid item xs={5} key={`${p}_enabled`}>
                    <InputLabel margin="dense" key={`${p}_enabled_label`}>Enabled</InputLabel>
                    <Checkbox
                        key={`${p}_enabled_input`}
                        checked={pass.enabled}
                        onChange={(e) => this.updatePassParam(p,'enabled', e.target.checked)}
                    />
                </Grid>
            );

            let rendertoscreen = (
                <Grid item xs={7} key={`${p}_rendertoscreen`}>
                    <InputLabel margin="dense" key={`${p}_rendertoscreen_label`}>Render To Screen</InputLabel>
                    <Checkbox
                        key={`${p}_rendertoscreen_input`}
                        checked={pass.renderToScreen}
                        onChange={(e) => this.updatePassParam(p,'rendertoscreen', e.target.checked)}
                    />
                </Grid>
            );

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
                            onChange={(e)=>this.updatePassDefine(p,d, e.target.value)}
                        />
                    </Grid>
                );
            }

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
                                onChange={(e) => this.updatePassUniform(p,u, e.target.value)}
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
                        <Typography variant="h5" className={classes.heading}>{map.passes[p].constructor.name}</Typography>
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
                        {/* <IconButton disabled size="small"><UpIcon /></IconButton>
                        <IconButton disabled size="small"><DownIcon /></IconButton> */}
                    </ExpansionPanelActions>
                </ExpansionPanel>
            );
        }
        
        this.passes = passes;
    }

    render() {
        const {classes} = this.props;

        return (
            <Paper className={`${classes.root} ${this.props.selected ? classes.highlighted : ''}`} ref={mount => { this.mount = mount }} onClick={() => this.handleClick()}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Typography className={classes.type} variant="h5">{this.props.map.name}</Typography>
                    </Grid>
                    {this.passes}
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withRouter(MapTools));