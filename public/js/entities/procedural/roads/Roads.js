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
}
