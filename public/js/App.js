import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TerrainSandbox from './sandboxes/TerrainSandbox';
import MapSandbox from './sandboxes/MapSandbox';

function AppRouter(){
  return (
    <Router>
      <div>
        <div className="panel-left">
          <h1>Procedural Tools</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/terrain/">Terrain</Link>
              </li>
              <li>
                <Link to="/maps/">Maps</Link>
              </li>
            </ul>
          </nav>
        </div>

        <Route path="/" exact component={MapSandbox} />
        <Route path="/terrain/" component={TerrainSandbox} />
        <Route path="/maps/" component={MapSandbox} />
      </div>
    </Router>
  );
}

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
