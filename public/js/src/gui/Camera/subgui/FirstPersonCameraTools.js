import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export default class FirstPersonCameraTools extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <h3>Here lies the FirstPersonCameraTools</h3>
                <Button>Activate</Button>
            </div>
        );
    }
};