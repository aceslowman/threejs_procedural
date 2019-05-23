import React from 'react';
import * as dg from "dis-gui";

const guiStyle = {
  position: 'relative',
  left: 0,
  top: 30,
  backgroundColor: '#000',
};

export default class Terrain extends React.Component {
  constructor(props) {
    super(props);
    this.elements = [];

    this.state = {
      maps: props.data,
      elements: []
    }
  }

  assembleMeshControls() {
    this.mesh_controls = [];
    let p_k = 0;

    for (let p in this.props.terrain) {
      let param = this.props.terrain[p];

      if (typeof param === 'number') {
        this.mesh_controls.push(
          <dg.Number
            key={p_k++}
            label={p}
            value={param}
            step={0.01}
            onChange={(val) => this.props.updateTerrain(p, val)}
          />
        );
      } else if (typeof param === 'string') {
        this.mesh_controls.push(
          <dg.Text
            key={p_k++}
            label={p}
            value={param}
          />
        );
      } else {
        console.warn('terrain parameter not mapped to GUI');
      }
    }
  }

  assembleElevationControls() {
    this.elev_controls = [];
    let m_k = 0;

    for (let m in this.props.maps) {
      let map = this.props.maps[m];

      for (let p in map.passes) {
        let pass = this.props.passes[map.passes[p]];

        let pass_controls = [];
        let p_k = 0;

        pass_controls.push(
          <dg.Checkbox
            key={p_k++}
            label='enabled'
            checked={pass.params.enabled}
            onChange={(val) => this.props.updatePassParam(map.passes[p], 'enabled', val)}
          />
        );

        pass_controls.push(
          <dg.Checkbox
            key={p_k++}
            label='renderToScreen'
            checked={pass.params.renderToScreen}
            onChange={(val) => this.props.updatePassParam(map.passes[p], 'renderToScreen', val)}
          />
        );

        for (let d in pass.defines) {
          let define = pass.defines[d];
          pass_controls.push(
            <dg.Number
              key={p_k++}
              label={d}
              value={define}
              min={0}
              max={20}
              step={1}
              onFinishChange={(val) => this.props.updatePassDefine(map.passes[p], d, val)}
            />);
        }

        for (let u in pass.uniforms) {
          let uniform = pass.uniforms[u];

          if (typeof uniform.value === 'number') {
            pass_controls.push(
              <dg.Number
                key={p_k++}
                label={u}
                value={uniform.value}
                step={0.01}
                onChange={(val) => this.props.updatePassUniform(map.passes[p], u, val)}
              />
            );
          } else if (typeof uniform.value === 'object') {
            pass_controls.push(
              <dg.Text
                key={p_k++}
                label={u}
                value={uniform.value.name}
              />
            );
          }
        }

        this.elev_controls.push(
          <dg.Folder key={m_k} label={pass.id} expanded={true}>
            {pass_controls}
          </dg.Folder>
        );

        m_k++;
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.assembleMeshControls();
      this.assembleElevationControls();
    }
  }

  componentDidMount() {
    this.assembleMeshControls();
    this.assembleElevationControls();
  }

  render() {
    return (
      <div>
        <div>
          <button>Add Pass</button>
          <select>
            <option>FractalNoise</option>
            <option>FractalWarp</option>
          </select>
        </div>

        <dg.GUI style={guiStyle}>
          {this.mesh_controls}
        </dg.GUI>
        <dg.GUI style={guiStyle}>
          {this.elev_controls}
        </dg.GUI>
      </div>
    );
  }
}
