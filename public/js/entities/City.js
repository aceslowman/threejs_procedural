import * as THREE from "three";
import ProceduralRoads from '../components/procedural/ProceduralRoads';
import ProceduralTerrain from '../components/procedural/ProceduralTerrain';
import ProceduralMap from '../components/procedural/ProceduralMap';

/*
  City
*/

export default class City{

  constructor(manager){
    this.manager = manager;
    this.clock = manager.clock;
    this.scene = manager.scene;
    this.gui = manager.gui;

    this.elevation = new ProceduralMap(this, {
        size: [256,256],
        time: Math.random()*1000,
        bSmooth: true,
        map: [-1,1],
        scale: [0.2,0.2],
        offset: [0,0],
        octaves: 8
    });

    this.terrain = new ProceduralTerrain(this, {
      size: [1,1],
      elevation: this.elevation,
      detail: 128.0,
      amplitude: 0.8
    });

    this.population = this.elevation;

    this.roads = new ProceduralRoads(this, {
      population: this.elevation,
      terrain: this.terrain
    });

    this.setup();
    this.addToScene();
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    this.roads.setup();

    this.elevation.setupDisplay();
    this.population.setupDisplay();

    this.setupGUI();
  }

  update(){}

  addToScene(){
    this.manager.addEntity(this);
  }

  setupGUI(){
    this.gui.roads = this.gui.addFolder("Road");
    this.gui.roads.add(this.roads.pointsMesh,"visible").name("pointsMesh");
    this.gui.roads.add(this.roads.crossingsMesh,"visible").name("crossingsMesh");
    this.gui.roads.add(this.roads.lineSegmentsMesh,"visible").name("lineSegmentsMesh");

    this.gui.terrain = this.gui.addFolder("Terrain");
    this.gui.terrain.add(this.terrain.mesh,"visible");
    this.gui.terrain.add(this.terrain.material,"wireframe");
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');

    this.gui.elevation = this.gui.addFolder("Elevation");
    // this.gui.elevation.add(this.elevation.outputQuad,"visible");
    // this.gui.elevation.add(this.elevation.uniforms.map,"value",[-2,-2],[2,2]).name("map");
    // this.gui.elevation.add(this.elevation.uniforms.scale,"value",[-10,-10],[10,10]).name("scale");
    // this.gui.elevation.add(this.elevation.uniforms.octaves,"value",0,12).name("octaves");
  }
}
