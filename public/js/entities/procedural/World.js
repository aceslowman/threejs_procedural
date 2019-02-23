import * as THREE from 'three';
import Roads from './roads/Roads';
import Terrain from './Terrain';

/*
  World
*/

export default class World{
  constructor(manager){
    this.manager = manager;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 5;

    this.terrain = new Terrain(this, {
      size: [500,500],
      detail: 128.0,
      amplitude: 300
    });

    this.roads = new Roads(this);

    this.setup();
    this.addToScene();

    window.addEventListener('mousemove', (e)=>this.onMouseMove(e), false);
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    this.roads.setup();
    this.roads.setupDebug();

    this.terrain.elevation.setupDisplay(
      'elevation',
      new THREE.Vector2((-this.manager.width/2.0) + 148,-128)
    );
    this.roads.system.population.setupDisplay(
      'population',
      new THREE.Vector2((-this.manager.width/2.0) + 148,128)
    );

    this.setupGUI();
  }

  onMouseMove(e){
    e.preventDefault();

    let mouse = new THREE.Vector2();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    this.roads.onMouseMove(e, mouse);
  }

  addToScene(){
    this.manager.addEntity(this);
  }

  update(){
    this.roads.updateDebug();
  }

  setupGUI(){
    this.manager.gui.system = this.manager.gui.addFolder('Road System');
    this.manager.gui.system.add(this.roads.system.mesh.points,'visible').name('pointsMesh');
    this.manager.gui.system.add(this.roads.system.mesh.crossings,'visible').name('crossingsMesh');
    this.manager.gui.system.add(this.roads.system.mesh.lineSegments,'visible').name('lineSegmentsMesh');

    this.manager.gui.terrain = this.manager.gui.addFolder('Terrain');
    this.terrain.mesh.visible = false;
    this.manager.gui.terrain.add(this.terrain.mesh,'visible');
    this.manager.gui.terrain.add(this.terrain.material,'wireframe');
    this.manager.gui.terrain.add(this.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.manager.gui.terrain.add(this.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');
  }
}
