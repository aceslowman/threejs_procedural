import RoadSystem from './RoadSystem';

export default class Roads{
  constructor(world){
    this.world = world;
    this.system = new RoadSystem(this.world, this.world.terrain);
  }

  setup(){
    this.system.setup();
  }

  setupDebug(){
    this.system.setupDebug();
  }

  updateDebug(){
    this.system.updateDebug();
  }

  onMouseMove(e, mouse){
    this.system.updateMousePicker(mouse, true, true);
  }

  setupGUI(){
    this.gui = this.world.manager.gui;

    this.gui.system = this.gui.addFolder('Road System');
    this.gui.system.add(this.system.mesh.points,'visible').name('pointsMesh');
    this.gui.system.add(this.system.mesh.crossings,'visible').name('crossingsMesh');
    this.gui.system.add(this.system.mesh.lineSegments,'visible').name('lineSegmentsMesh');

    this.gui.open();
    this.gui.system.open();
  }
}
