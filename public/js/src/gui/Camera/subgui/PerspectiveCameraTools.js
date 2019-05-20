import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// import Slider from 'material-ui-slider-label/Slider';

const styles = {
    gridBump: {
        // position: 'relative !important',
        // top: '10px !important'
        marginTop: '15px'
    },
    gridOuter: {
        margin: '15px'
    },
    gridInner: {
        alignItems: 'center'
    }
};

export default class PerspectiveCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Grid container  style={styles.gridOuter}spacing={8} justify="center">
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth={true}>Activate</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth={true}>Activate</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth={true}>Activate</Button>
                    </Grid>

                    <Divider />

                    <Grid container alignItems="center">
                        <Grid item xs={2}>
                            <TextField
                                id="zoom-number"
                                label="zoom"
                                value="0"
                                step="5"
                                onChange={(e) => { console.log('changed' + e) }}
                                type="number"
                                variant="filled"
                                margin="dense"
                                style={styles.textfield}
                            />
                        </Grid>
                        <Grid item xs={10} style={styles.gridBump}>
                            <Slider 
                                min={-10} 
                                max={10} 
                                value={0} 
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField 
                            label="fov" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                
                    <Grid item xs={4 }>
                        <TextField 
                            label="near" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="far" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="focus" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="aspect" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="filmGauge" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="filmOffset" 
                            type="number" 
                            value="0" 
                            variant="filled" 
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            label="filmOffset"
                            type="number"
                            value="0"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>     
                    
                </Grid>

                <Grid container style={styles.gridOuter}>
                    <Grid item xs={12}>
                        <Slider />
                    </Grid>           
                </Grid>

                
                {/* TRANSFORM */}
                <Typography variant="h6">Transform</Typography>

                <Divider />

                <Grid container style={styles.gridOuter}>
                    <Grid item xs={4}>
                        <TextField
                            label="x"
                            InputLabelProps={{ shrink: true }} 
                            type="number"
                            value="0"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            label="y"
                            InputLabelProps={{ shrink: true }} 
                            type="number"
                            value="0"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            label="z"
                            InputLabelProps={{ shrink: true }} 
                            type="number"
                            value="0"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                        />
                    </Grid> 
                </Grid>
            </div>
        );
    }
};
