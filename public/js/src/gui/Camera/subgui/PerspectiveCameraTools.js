import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


export default class PerspectiveCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>Here lies the PerspectiveCameraTools</h3>
                {/* <Button>Activate</Button> */}
                <Grid container spacing={24} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Button fullWidth={true}>Activate</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField 
                            label="fov" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="zoom" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="near" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="far" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="focus" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="aspect" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="filmGauge" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                    <Grid item xs={4 }>
                        <TextField 
                            label="filmOffset" 
                            type="number" 
                            value="0" 
                            variant="outlined" 
                            margin="dense"
                        />
                    </Grid>
                    
                </Grid>
            </div>
        );
    }
};