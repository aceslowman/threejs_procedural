import * as THREE from "three";

import StandardManager from "./system/StandardManager";
import Capture from "./utilities/Capture";
import Debug from "./utilities/Debug";
import City from "./entities/City";
import Camera from "./entities/Camera";
import PointLight from "./entities/PointLight";

let manager, debug, capturer, camera, light;
let city;

/*
  main.js is to assemble all of the entities for the scene.

  entities are each individual object.

  components are what make those objects up.
*/

const setup = () => {
  manager = new StandardManager();

  city = new City(manager);

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
}

setup();
bindEventListeners();
render();
