import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import ProceduralMap from './ProceduralMap';
import TessellateModifier from "../../utilities/modifiers/TesselateModifier";

class Block {
  constructor() {
    this.polygon = new THREE.Mesh();
  }
}

class Road {
  constructor(it, prev, end) {
    this.node = end;
    this.prev = prev;
    this.siblings = [];

    this.it = it;
  }

  addSibling(a) {
    this.siblings.push(a);
  }

  removeSibling(a) {
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
    this.world = world;
    this.terrain = options.terrain;
    this.population = this.terrain.elevation;

    this.placed = [];
    this.pending = [];
    this.crossings = [];
    this.blocks = [];

    this.road_limit = 50;
    this.road_scalar = 50;

    this.pointsGeometry = new THREE.Geometry();
    this.crossingsGeometry = new THREE.Geometry();

    this.pointsMesh = new THREE.Points();
    this.crossingsMesh = new THREE.Points();
    this.lineSegmentsMesh = new THREE.LineSegments();

    this.labels = [];

    this.verbose = true;

    this.chooserID = null;
    this.chooserObjects = [];
  }

  setup() {
    this.buildRoads();
    this.postBuildRoads();

    this.setupLineSegments();
    this.setupPointsMesh();
    this.setupCrossingsMesh();
    this.setupDebugNumbers();

    this.buildBlocks();
  }

  setupPointsMesh() {
    let material = new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size: 12,
      sizeAttenuation: false,
      depthTest: false
    });

    for (let a of this.placed) {
      this.pointsGeometry.vertices.push(a.node);
      this.pointsGeometry.colors.push(new THREE.Color(0,0,1));
    }

    this.pointsGeometry.colorsNeedUpdate = true;

    this.pointsMesh = new THREE.Points(this.pointsGeometry, material);
    this.world.manager.scene.add(this.pointsMesh);
  }

  setupCrossingsMesh() {
    let material = new THREE.PointsMaterial({
      color: 'red',
      size: 7,
      sizeAttenuation: false,
      depthTest: false
    });

    for (let a of this.crossings) {
      this.crossingsGeometry.vertices.push(a);
    }

    this.crossingsMesh = new THREE.Points(this.crossingsGeometry, material);
    this.world.manager.scene.add(this.crossingsMesh);
  }

  setupLineSegments() {
    let lineGeometry = new THREE.BufferGeometry();
    let points = [];

    for (let a of this.placed) {
      for (let b of a.siblings) {
        if (b.prev) {
          points.push(a.node.x, a.node.y, a.node.z, b.node.x, b.node.y, b.node.z);
        }
      }
    }

    lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    let material = new THREE.LineBasicMaterial({
      color: 'yellow',
      linewidth: 1.0
    });
    this.lineSegmentsMesh = new THREE.LineSegments(lineGeometry, material);
    this.world.manager.scene.add(this.lineSegmentsMesh);
  }

  setupDebugNumbers() {
    //TODO: this is not especially useful. it would be nice to have billboarding
    for (let i = 0; i < this.placed.length; i++) {
      // fill up member array (this.labels) with new objects
      let cont = document.createElement("div");
      let label = document.createElement("h6");
      label.appendChild(document.createTextNode(i));

      label.style.margin = "0px";
      label.style.color = "white";
      label.style.fontSize = "1.2em";

      // cont.style.backgroundColor = "black"; // NOTE: difficult to see overlaps
      cont.style.position = "absolute";
      cont.style.zIndex = 100;

      cont.appendChild(label);
      cont.classList.add("road_label");
      cont.id = i;

      document.body.appendChild(cont);
    }

    this.debug_elements = document.getElementsByClassName("road_label");
  }

  updateDebugNumbers() {
    for (let i = 0; i < this.debug_elements.length; i++) {
      let element = this.debug_elements[i];
      let manager = this.world.manager;

      let node = this.placed[element.id].node;
      let cam = manager.camera.getCamera();
      let canvas = manager.renderer.context.canvas;

      let loc = ASMATH.world2Screen(node, cam, canvas);

      element.style.left = (loc.x) + "px";
      element.style.top = (loc.y) + "px";
    }
  }

  updateSiblingDebug(mouse) {
    let camera = this.world.manager.camera.getCamera();

    this.world.raycaster.setFromCamera(mouse, camera);

    let intersects = this.world.raycaster.intersectObject(this.pointsMesh, true);

    if(intersects.length > 0){
      if(this.chooserID != intersects[0].index){
        this.chooserID = intersects[0].index;
        this.pointsMesh.geometry.colors[this.chooserID] = new THREE.Color('orange');
        this.pointsMesh.geometry.colorsNeedUpdate = true;

        // create line to all siblings
        for(let sib of this.placed[this.chooserID].siblings){
          let geo = new THREE.Geometry();
          geo.vertices.push(this.placed[this.chooserID].node, sib.node);
          let line = new THREE.Line(geo, new THREE.LineBasicMaterial({
            color: 'purple'
          }));
          this.chooserObjects.push(line);
          this.world.manager.scene.add(line);
        }
        // create line to prev
        // if(this.placed[this.chooserID].prev){
        //   let geo = new THREE.Geometry();
        //   geo.vertices.push(this.placed[this.chooserID].node, this.placed[this.chooserID].prev.node);
        //   let line = new THREE.Line(geo, new THREE.LineBasicMaterial({
        //     color: 'green'
        //   }));
        //   this.chooserObjects.push(line);
        //   this.world.manager.scene.add(line);
        // }
      }
  	}else{
      if(this.chooserID != null){
        this.pointsMesh.geometry.colors[this.chooserID] = new THREE.Color('blue');
        this.pointsMesh.geometry.colorsNeedUpdate = true;
        this.chooserID = null;

        for(let l of this.chooserObjects){
          this.world.manager.scene.remove(l);
        }

        this.chooserObjects = [];
      }
    }
  }

  setupDebug() {
    let table = {};
    table.number_in_placed = this.placed.length;
    table.number_in_crossings = this.crossings.length;
    table.number_in_pending = this.pending.length;

    console.table(table);
    console.log("PLACED", this.placed);
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
          a.prev.siblings.push(a);
          a.siblings.push(a.prev); // TEMP: this is experimental
        }

        this.placed.push(a);
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
   * For all processes required after the construction of the road system
   */
  postBuildRoads() {
    this.subdivide();
    this.elevate();
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
   * Subdivide all roads by a given number of iterations.
   * @param {int} level - the number of subdivisions applied.
   */
  subdivide() {

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
    let dedupe = this.checkForDuplicates(a, 10);

    return dedupe;
  }

  /**
   * Checks for any intersections between a and any placed road. A is truncated
   * to the closest intersection if an intersection is found.
   * @param {Road} a - the current road, recently having passed localConstraints.
   * @returns {Bool} returns true if an intersection is found, false if not.
   */
  checkForCrossings(a) {
    let crossings = [];

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
      crossings.sort((A, B) => {
        return (
          a.prev.node.distanceToSquared(A.location) - a.prev.node.distanceToSquared(B.location)
        );
      });

      let match = crossings[0];
      this.crossings.push(match.location);
      a.node = match.location;

      // TODO: set siblings once a crossing is found
      match.b.removeSibling(match.c);
      match.c.removeSibling(match.b);
      a.addSibling(match.b);
      a.addSibling(match.c);
      match.b.addSibling(a);
      match.c.addSibling(a);

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
   */
  checkForDuplicates(a, thresh) {
    let ok = true;

    for (let b of this.placed) {
      if (a.node.distanceTo(b.node) <= thresh) {
        a.prev.addSibling(b); // a is still orphaned in some places...
        b.addSibling(a.prev);

        for (let sib of a.siblings) {
          b.addSibling(sib);
          sib.addSibling(b);
          sib.removeSibling(a);
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

  /**
   * Uses finished road system to generate building 'blocks', which are to be
   * divided into lots.
   */
  buildBlocks() {
    for (let i = 0; i < this.placed.length; i++) {
      let geometry = new THREE.BufferGeometry();

      let t_vertices = [];

      let first = this.placed[i];
      let next = first;

      let j = 0; // TEMP

      do {
        t_vertices.push(next.node.x, next.node.y, next.node.z);

        if(next.siblings.length == 0){
            console.warn("No more siblings! Ending.");
            break;
        }

        // try sorting by dot product...
        next.siblings.sort((a,b)=>{
          let dot_a = (next.x * a.x) + (next.y * a.y);
          let dot_b = (next.x * b.x) + (next.y * b.y);

          return dot_a - dot_b;
        });

        console.log("SIBLINGS", next.siblings);

        if(next.prev != next.siblings[0]){
          next = next.siblings[0]; // choose leftmost
        }else{
          next = next.siblings[1]; // choose next leftmost
        }


        // it keeps going back over the same 'next'
        // for (let sib of next.siblings) {
        //   if(sib == next.prev) continue; // don't check on prev
        //
        //
        //
        //   /*
        //   function angle(cx, cy, ex, ey) {
        //     var dy = ey - cy;
        //     var dx = ex - cx;
        //     var theta = Math.atan2(dy, dx); // range (-PI, PI]
        //     theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //     //if (theta < 0) theta = 360 + theta; // range [0, 360)
        //     return theta;
        //   }
        //
        //   https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
        //   */
        //   let a = next.node;
        //   let b = sib.node;
        //
        //   let t_theta = Math.atan2(b.y - a.y, b.x - a.x);
        //
        //   console.log("ATAN2", t_theta);
        //
        //   if (theta == null) theta = t_theta;
        //
        //   if (t_theta < theta) {
        //     console.log("one found further left");
        //
        //     theta = t_theta;
        //     next = sib;
        //
        //     // dont break! I have to check every sibling...
        //   }
        // }

        j++; //TEMP
        if (j == 500) break; // TEMP

      } while (first != next); // and while next still has siblings!

      let vertices = new Float32Array(t_vertices); // NOTE: EMPTY

      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

      /* SETUP BLOCK DISPLAY */
      let material = new THREE.MeshBasicMaterial({
        'color': 'white'
      });
      let line_material = new THREE.LineBasicMaterial({
        color: 'green',
        linewidth: 3.0,
      });
      let point_material = new THREE.PointsMaterial({
        color: 'green',
        size: 14,
        sizeAttenuation: false,
        depthTest: false
      });

      // let mesh = new THREE.Mesh(geometry, material);
      let line_mesh = new THREE.Line(geometry, line_material);
      let point_mesh = new THREE.Points(geometry, point_material);

      // this.world.manager.scene.add(mesh);
      this.world.manager.scene.add(line_mesh);
      this.world.manager.scene.add(point_mesh);
      /* */

      break; // DEBUG
    }
  }
}
