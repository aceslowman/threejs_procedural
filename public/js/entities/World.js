import * as THREE from "three";
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
    // this.world.terrain.elevation.setupDisplay(
    //   "elevation",
    //   new THREE.Vector2(-128,-128)
    // );
    // this.world.roads.population.setupDisplay(
    //   "population",
    //   new THREE.Vector2(-128,128)
    // );
    this.setupGUI();
  }

  update(){
    this.world.roads.updateDebug();
  }

  addToScene(){
    this.manager.addEntity(this);
  }

  setupGUI(){
    this.gui.roads = this.gui.addFolder("Road");
    this.gui.roads.add(this.world.roads.mesh.points,"visible").name("pointsMesh");
    this.gui.roads.add(this.world.roads.mesh.crossings,"visible").name("crossingsMesh");
    this.gui.roads.add(this.world.roads.mesh.lineSegments,"visible").name("lineSegmentsMesh");

    this.gui.terrain = this.gui.addFolder("Terrain");
    this.world.terrain.mesh.visible = false;
    this.gui.terrain.add(this.world.terrain.mesh,"visible");
    this.gui.terrain.add(this.world.terrain.material,"wireframe");
    this.gui.terrain.add(this.world.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.gui.terrain.add(this.world.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');
  }
}
