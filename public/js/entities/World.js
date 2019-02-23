import * as THREE from 'three';
import ProceduralWorld from '../components/procedural/ProceduralWorld';

/*
  World
*/

export default class World{
  constructor(manager){
    this.manager = manager;
    this.clock   = manager.clock;
    this.scene   = manager.scene;
    this.gui     = manager.gui;

    this.world = new ProceduralWorld(manager);

    this.setup();
    this.addToScene();
  }

  setup(){
    this.world.setup();
    this.world.terrain.elevation.setupDisplay(
      'elevation',
      new THREE.Vector2((-this.manager.width/2.0) + 148,-128)
    );
    this.world.roadSystem.population.setupDisplay(
      'population',
      new THREE.Vector2((-this.manager.width/2.0) + 148,128)
    );
    this.setupGUI();
  }

  update(){
    this.world.roadSystem.updateDebug();
  }

  addToScene(){
    this.manager.addEntity(this);
  }

  setupGUI(){
    this.gui.roadSystem = this.gui.addFolder('Road System');
    this.gui.roadSystem.add(this.world.roadSystem.mesh.points,'visible').name('pointsMesh');
    this.gui.roadSystem.add(this.world.roadSystem.mesh.crossings,'visible').name('crossingsMesh');
    this.gui.roadSystem.add(this.world.roadSystem.mesh.lineSegments,'visible').name('lineSegmentsMesh');

    this.gui.terrain = this.gui.addFolder('Terrain');
    this.world.terrain.mesh.visible = false;
    this.gui.terrain.add(this.world.terrain.mesh,'visible');
    this.gui.terrain.add(this.world.terrain.material,'wireframe');
    this.gui.terrain.add(this.world.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.gui.terrain.add(this.world.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');
  }
}
