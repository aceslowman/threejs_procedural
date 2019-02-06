import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import * as ASMATH from "../../utilities/Math";
import ProceduralMap from './ProceduralMap';

/*

  Current thoughts:

  this shouldn't really be responsible for EVERYTHING. The ProceduralRoads class
  should only generate the undirected graph representing the road system.

  It should not generate blocks
  It should not create anything resembling a city

  It is ONLY an undirected graph, that follows a set of rules that generates
  something resembling the patterns and likeness of an abstract road system.

  there are still problems with the core algorithm, and I need to fix them
  before moving on
*/

class Road {
  constructor(it, prev, end) {
    this.id       = null;
    this.node     = end;
    this.prev     = prev;
    this.siblings = [];

    this.it       = it;

    this.chosen   = false;
  }

  connect(a) {
    if(!this.siblings.includes(a) && a != this){
      this.siblings.push(a);
    }
  }

  sever(a) {
    // There should never be orphaned connections

    // remove (this) from (a)
    for (let i = 0; i < a.siblings.length; i++) {
      if (this == a.siblings[i]) {
        a.siblings.splice(i, 1);
      }
    }

    // remove (a) from (this)
    for (let i = 0; i < this.siblings.length; i++) {
      if (a == this.siblings[i]) {
        this.siblings.splice(i, 1);
      }
    }
  }
}

class Crossing {
  constructor(a, b, c, location) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.location = location;
  }
}

export default class ProceduralRoads {
  constructor(world, options) {
    this.world      = world;
    this.terrain    = options.terrain;
    this.population = this.terrain.elevation;

    this.placed    = [];
    this.pending   = [];
    this.crossings = [];

    this.road_limit  = 50;
    this.road_scalar = 50;

    this.pointsGeometry    = new THREE.Geometry();
    this.crossingsGeometry = new THREE.Geometry();

    this.pointsMesh       = new THREE.Points();
    this.crossingsMesh    = new THREE.Points();
    this.lineSegmentsMesh = new THREE.LineSegments();

    this.verbose = true;

    this.road_chooser_id = null;

    this.chooserObjects = [];
  }

  setup() {
    this.buildRoads();
    // this.elevate(); //TEMP
    this.setupDebug();
  }

  setupDebug() {
    for (let a of this.placed) {
      this.pointsGeometry.vertices.push(a.node);
      this.pointsGeometry.colors.push(new THREE.Color(0,0,1));
    }

    this.pointsGeometry.colorsNeedUpdate = true;

    this.pointsMesh = new THREE.Points(this.pointsGeometry, new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size: 12,
      sizeAttenuation: false,
      depthTest: false
    }));

    for (let a of this.crossings) {
      this.crossingsGeometry.vertices.push(a);
    }

    this.crossingsMesh = new THREE.Points(this.crossingsGeometry, new THREE.PointsMaterial({
      color: 'red',
      size: 7,
      sizeAttenuation: false,
      depthTest: false
    }));

    let points = [];

    for (let a of this.placed) {
      for (let b of a.siblings) {
        if (b.prev) {
          points.push(a.node.x, a.node.y, a.node.z, b.node.x, b.node.y, b.node.z);
        }
      }
    }

    let lineGeometry = new THREE.BufferGeometry();
    lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    this.lineSegmentsMesh = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
      color: 'black',
      linewidth: 2.0,
      depthTest: false
    }));

    this.lineSegmentsMesh.renderOrder = 30;

    this.pointsMesh.renderOrder = 100;
    this.crossingsMesh.renderOrder = 100;

    this.world.manager.scene.add(this.lineSegmentsMesh);
    this.world.manager.scene.add(this.pointsMesh);
    this.world.manager.scene.add(this.crossingsMesh);

    //TODO: this is not especially useful. it would be nice to have billboarding
    for (let i = 0; i < this.placed.length; i++) {
      let cont = document.createElement("div");
      let label = document.createElement("h6");
      label.appendChild(document.createTextNode(i));

      cont.appendChild(label);
      cont.classList.add("road_label");
      cont.id = i;

      document.body.appendChild(cont);
    }

    this.debug_elements = document.getElementsByClassName("road_label");
  }

  updateDebug() {
    for (let i = 0; i < this.debug_elements.length; i++) {
      let element = this.debug_elements[i];
      let manager = this.world.manager;

      let node = this.placed[element.id].node;
      let cam = manager.camera.getCamera();
      let canvas = manager.renderer.context.canvas;

      let loc = ASMATH.world2Screen(node, cam, canvas);

      element.style.left = (loc.x - 15) + "px";
      element.style.top = (loc.y + 5) + "px";
    }
  }

  updateMousePicker(mouse, block_chooser, show_textbox) {
    let camera = this.world.manager.camera.getCamera();

    // first, check for road intersections.
    this.world.raycaster.setFromCamera(mouse, camera);

    let intersects_road = this.world.raycaster.intersectObject(this.pointsMesh, true);

    if(intersects_road.length > 0){
      if(this.road_chooser_id != intersects_road[0].index){
        this.road_chooser_id = intersects_road[0].index;
        this.pointsMesh.geometry.colors[this.road_chooser_id] = new THREE.Color('orange');
        this.pointsMesh.geometry.colorsNeedUpdate = true;

        // create line to all siblings
        for(let sib of this.placed[this.road_chooser_id].siblings){
          let geo = new THREE.Geometry();
          geo.vertices.push(this.placed[this.road_chooser_id].node, sib.node);

          let line = new MeshLine();
          line.setGeometry( geo );

          let material = new MeshLineMaterial({
            color: 'purple',
            resolution: new THREE.Vector2(this.world.manager.width, this.world.manager.height),
            sizeAttenuation: 1,
            lineWidth: 0.008
          });

          let meshline = new THREE.Mesh(line.geometry, material);
          meshline.renderOrder = 50;
          this.chooserObjects.push(meshline);
          this.world.manager.scene.add(meshline);
        }

        // create line to prev node
        if(this.placed[this.road_chooser_id].prev){
          let geo = new THREE.Geometry();
          geo.vertices.push(this.placed[this.road_chooser_id].node, this.placed[this.road_chooser_id].prev.node);

          let line = new MeshLine();
          line.setGeometry( geo );

          let material = new MeshLineMaterial({
            color: 'orange',
            resolution: new THREE.Vector2(this.world.manager.width, this.world.manager.height),
            sizeAttenuation: 1,
            lineWidth: 0.003
          });

          let meshline = new THREE.Mesh(line.geometry, material);
          meshline.renderOrder = 50;
          this.chooserObjects.push(meshline);
          this.world.manager.scene.add(meshline);
        }

        // display text box with full information
        if(show_textbox){
          let container = document.createElement("div");
          container.appendChild(document.createTextNode("Siblings: "));

          let sib_ul = document.createElement("ul");

          for(let sib of this.placed[this.road_chooser_id].siblings){
            let sib_li = document.createElement("li");
            sib_li.innerHTML = sib.id;
            sib_ul.appendChild(sib_li);
          }

          container.appendChild(sib_ul);

          container.appendChild(document.createTextNode("Previous: " + this.placed[this.road_chooser_id].prev.id));

          container.classList.add("road_textbox");
          container.id = "t"+this.road_chooser_id;
          container.style.backgroundColor = "black";
          container.style.position = "absolute";
          container.style.padding = "15px";
          container.style.margin = "15px";
          container.style.border = "1px solid white";

          let node = this.placed[this.road_chooser_id].node;
          let cam = this.world.manager.camera.getCamera();
          let canvas = this.world.manager.renderer.context.canvas;

          container.style.left = "0px";
          container.style.top = "0px";
          container.style.zIndex = 200000;

          document.body.appendChild(container);
        }
      }
  	}else{
      if(this.road_chooser_id != null){
        if(show_textbox){
          document.getElementById("t"+this.road_chooser_id).remove();
        }
        this.pointsMesh.geometry.colors[this.road_chooser_id] = new THREE.Color('blue');
        this.pointsMesh.geometry.colorsNeedUpdate = true;
        this.road_chooser_id = null;

        for(let l of this.chooserObjects){
          this.world.manager.scene.remove(l);
        }

        this.chooserObjects = [];
      }
    }
  }

  /**
   * builds the collection of roads.
   */
  buildRoads() {
    this.pending.push(new Road(0, null, new THREE.Vector3(0, 0, 0)));

    while (this.pending.length > 0) {
      this.pending.sort((a, b) => {
        return a.it - b.it;
      });

      let a = this.pending[0];

      let accepted = this.localConstraints(a);

      if (accepted) {
        if (a.prev) {
          a.prev.connect(a);
          a.connect(a.prev); // TEMP: this is experimental
        }

        this.placed.push(a);
        a.id = this.placed.length - 1;
        this.pending.shift();

        let mode = 1;

        for (let b of this.globalGoals(a, mode)) {
          this.pending.push(b);
        }
      } else {
        this.pending.shift();
      }
    }
  }

  /**
   * TODO: potentially more appropriate to be done IN build, but for now, leave.
   * TODO: implement slope threshold
   * Checks for elevation. If it is too steep, it will be rejected. If not, the
   * a.z value will be defined.
   * @param {Float} thresh - the maximum incline allowed
   * @returns {Bool} returns success value.
   */
  elevate() {
    let thresh = 0.1; // FIXME: parameterize threshold!

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3(0, 0, 1);

    for (let endpoint of this.placed) {
      raycaster.set(endpoint.node, direction);
      let intersects = raycaster.intersectObject(this.terrain.mesh);

      if (intersects.length > 0) {
        let pI = intersects[0].point;
        endpoint.node = pI;
      }
    }
  }

  /**
   * Local constraints checks a for certain qualities. If it passes critical
   * tests, a is confirmed and placed into the 'placed' array.
   * @param {Road} a - the current unconfirmed road.
   * @returns {Bool} returns true if a has passed critical constraints.
   */
  localConstraints(a) {
    if (!a.prev) return true;

    let crossings = this.checkForCrossings(a);
    // let dedupe = this.checkForDuplicates(a, 10);

    // return dedupe;
    return true;
  }

  /**
   * Checks for any intersections between a and any placed road. A is truncated
   * to the closest intersection if an intersection is found.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @returns {Bool} returns true if an intersection is found, false if not.
   */
  checkForCrossings(a) {
    let crossings = [];

    // loop through all placed roads (b), and check for intersection with (a)
    for (let b of this.placed) {
      if (!b.prev || a.prev.node == b.prev.node || a.prev.node == b.node) {
        continue;
      }

      let c = b.prev;

      let intersect = ASMATH.getLineIntersection(a.prev.node, a.node, b.node, c.node);

      if (intersect) {
        crossings.push(new Crossing(a, b, c, intersect));
      }
    }

    if (crossings.length > 0) {

      // sort by distance from start
      crossings.sort((A, B) => {
        return (
          a.prev.node.distanceToSquared(A.location) - a.prev.node.distanceToSquared(B.location)
        );
      });

      let match = crossings[0];

      // move (a) to the crossing location
      this.crossings.push(match.location);
      a.node = match.location;

      // sever siblings
      match.b.sever(match.c);
      match.b.connect(a);
      match.c.connect(a);

      return true;
    }

    return false;
  }

  /**
   * Checks for any roads that duplicate the end point of Road a. If there is a
   * duplicate, a will be rejected, and a.prev will be bound to the match.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @param {Float} thresh - how far a node can be for being merged.
   * @returns {Bool} returns success value.
   *
   * FIXME:
   */
  checkForDuplicates(a, thresh) {
    let ok = true;

    for (let b of this.placed) {
      if (a.node.distanceTo(b.node) <= thresh) {
        // NOTE

        a.prev.connect(b); // a is still orphaned in some places...
        b.connect(a.prev);

        for (let sib of a.siblings) {
          b.connect(sib);
          sib.connect(b);
          sib.sever(a);
        }

        if (this.verbose) console.warn("duplicate found, a has failed.");
        ok = false;
        break;
      }
    }

    return ok;
  }

  /**
   * Global Goals generate new Roads from one accepted/placed Road.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @param {Float} mode - (0) angle, (1) population
   * @returns {Array} returns array of new Roads.
   */
  globalGoals(a, mode) {
    mode = 1;

    switch (mode) {
      case 0:
        return this.angleGoal(a, 0, 90);
      case 1:
        return this.populationGoal(a, 90);
    }
  }

  /**
   * A Global Goal following an angular constraint.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @param {Float} range - the maximum randomness around the chosen angle.
   * @param {Float} tendency - the angle chosen before randomness.
   * @returns {Array} returns array of new Roads.
   */
  angleGoal(a, range, tendency) {
    let t_pending = [];

    let max_goals = 2;

    (this.placed.length < this.road_limit) ? max_goals = 2: max_goals = 0;

    let quadrants = [1, 2, 3]; // i dont think it should be 4

    ASMATH.shuffle(quadrants);

    for (let i = 0; i < max_goals; i++) {

      if (a.prev) { // generate random angle
        let new_direction = new THREE.Vector3().subVectors(a.node, a.prev.node).normalize();

        let angle = THREE.Math.randFloat((tendency * quadrants[i]) - range, (tendency * quadrants[i]) + range);

        new_direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle * Math.PI / 180);

        let scalar = new THREE.Vector3(this.road_scalar, this.road_scalar, this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let endpoint = new THREE.Vector3().addVectors(a.node, new_node);

        if (this.terrain.globalBoundsCheck(endpoint)) {
          let new_road = new Road(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }
      } else { // define default point
        let new_direction = new THREE.Vector3(
          THREE.Math.randFloat(-1, 1),
          THREE.Math.randFloat(-1, 1),
          0
        ).normalize();

        let scalar = new THREE.Vector3(this.road_scalar, this.road_scalar, this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let endpoint = new THREE.Vector3().addVectors(a.node, new_node);

        if (this.terrain.globalBoundsCheck(endpoint)) {
          let new_road = new Road(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }

        break;
      }
    }

    return t_pending;
  }

  /**
   * A Global Goal following a population constraint, utilizing ProceduralMap.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @param {Float} range - the maximum angle to cast rays.
   * @returns {Array} returns array of new Roads.
   */
  populationGoal(a, range) {
    let t_pending = [];

    let numSample = 3; // parameterize
    let max_goals = 2; // parameterize
    let numRays = 3; // parameterize

    (this.placed.length < this.road_limit) ? max_goals = 2: max_goals = 0;

    for (let i = 0; i < max_goals; i++) {
      if (a.prev) {
        let final_ray = new THREE.Line3();
        let highestSum = 0;

        for (let j = 0; j < numRays; j++) {
          let ray = new THREE.Line3();
          let raySum = 0;

          let angle = THREE.Math.randFloat(-range, range);

          let direction = new THREE.Vector3();
          direction.subVectors(a.node, a.prev.node).normalize();
          direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle * Math.PI / 180);

          let scalar = new THREE.Vector3(
            this.road_scalar,
            this.road_scalar,
            this.road_scalar
          );

          let t_end = new THREE.Vector3();
          t_end.addVectors(a.node, direction.multiply(scalar));

          ray.set(a.prev.node, t_end);

          for (let k = 0; k <= numSample; k++) {
            let samp = ray.at((1.0 / numSample) * k);

            if (this.terrain.globalBoundsCheck(samp)) {
              let xcoord = ((samp.x + this.terrain.width / 2) / this.terrain.width); //normalized 0-1
              xcoord *= this.population.width;

              let ycoord = ((samp.y + this.terrain.height / 2) / this.terrain.height); //normalized 0-1
              ycoord *= this.population.height;

              // NOTE VERY POSSIBLE THIS IS SOLVED

              let pop = this.population.getSample(xcoord, ycoord);

              raySum += pop;
            }
          }

          if (raySum > highestSum) {
            highestSum = raySum;
            final_ray = ray;
          }
        }

        const endpoint = final_ray.at(1); // BAD

        if (this.terrain.globalBoundsCheck(endpoint)) {
          if (endpoint.x == 0 && endpoint.y == 0) {
            console.error("Major failure, you may be incorrectly sampling the population map.", endpoint);
          }

          t_pending.push(new Road(a.it + 1, a, endpoint));
        }

      } else {
        //OK
        let direction = new THREE.Vector3(
          THREE.Math.randFloat(-1, 1),
          THREE.Math.randFloat(-1, 1),
          0
        ).normalize();

        let scalar = new THREE.Vector3(
          this.road_scalar,
          this.road_scalar,
          this.road_scalar
        );

        const endpoint = new THREE.Vector3().addVectors(a.node, direction.multiply(scalar));

        if (this.terrain.globalBoundsCheck(endpoint)) {
          let new_road = new Road(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }
      }
    }

    return t_pending;
  }
}
