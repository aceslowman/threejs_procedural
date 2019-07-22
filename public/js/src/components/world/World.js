import React from 'react';
import SketchContext from '../../SketchContext';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import Subnavigation from './Subnavigation';

import Terrain from './terrain/Terrain';
import Sky from './sky/Sky';
import { Divider } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class World extends React.Component {
    static contextType = SketchContext;

    constructor(props, context) {
        super(props, context); 

        this.state = {
            currentGroup: 'Terrain'
        }
    }

    selectUIGroup(group) {
        this.setState({ currentGroup: group });
    }

    //------------------------------------------------------------------------
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root} style={{ display: this.props.display ? 'block' : 'none' }}>
                <Subnavigation 
                    selectGroup={(g)=>this.selectUIGroup(g)}
                />
                <Divider />
                <Terrain 
                    key='Terrain'
                    display={this.state.currentGroup == 'Terrain'}
                    width={this.props.width}
                    height={this.props.height}
                    detail={512}
                    amplitude={150}
                />
                <Sky
                    key='Sky'
                    display={this.state.currentGroup == 'Sky'}
                />
            </Paper>
        )
    }
}

export default withStyles(styles)(World);