import React from 'react';
import ReactDOM from 'react-dom';
import Sketch from './Sketch';

class App extends React.Component {
  render() {
    return (
      <Sketch />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
