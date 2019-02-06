import * as THREE from "three";

import StandardManager from "./system/StandardManager";
import Capture from "./utilities/Capture";
import Debug from "./utilities/Debug";
import World from "./entities/World";
import PerspectiveCamera from "./entities/PerspectiveCamera";
import OrthographicCamera from "./entities/OrthographicCamera";

let manager, debug, capturer, p_cam, o_cam, light;
let world;

const setup = () => {
  manager = new StandardManager({
    scene: {
      background: 'white'
    }
  });
  manager.gui.close();

  p_cam = new PerspectiveCamera(manager);
  o_cam = new OrthographicCamera(manager);

  manager.setCamera(o_cam);

  world = new World(manager);

  debug = new Debug(manager, {
    stats: true,
    grid: false
  });

  capturer = new Capture(manager, {
    verbose: false,
    display: true,
    framerate: 100,
    format: 'png',
    workersPath: 'js/utils/'
  });
}

const render = () => {
  requestAnimationFrame(render);

  debug.stats.begin();
  manager.update();
  debug.stats.end();

  capturer.capture( manager.canvas );
}

const bindEventListeners = () => {
  window.addEventListener(
    'resize',
    manager.onWindowResize.bind(manager),
    false
  );

  document.addEventListener(
    "keydown",
    onDocumentKeyDown,
    false
  );
}

const onDocumentKeyDown = (event) => {
  let keyCode = event.which;

  if(keyCode == 49){ // 1
    manager.setCamera(o_cam);
    p_cam.enable = false;
    o_cam.enable = true;
  }
  if(keyCode == 50){ // 2
    manager.setCamera(p_cam);
    o_cam.enable = false;
    p_cam.enable = true;
  }
  if(keyCode == 192){
    p_cam.orbitControls.reset();
    o_cam.orbitControls.reset();
  }
}

setup();
bindEventListeners();
render();
