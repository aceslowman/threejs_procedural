import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import ProceduralMap from './ProceduralMap';

class Road {
  constructor(it, prev, end){
    this.node = end;
    this.prev = prev;
    this.siblings = [];

    this.it = it;
  }

  addSibling(a){
    this.siblings.push(a);
  }

  removeSibling(a){
    for(let i = 0; i < this.siblings.length; i++){
      if(a == this.siblings[i]){
        this.siblings.splice(i, 1);
      }
    }
  }
}

class Crossing {
  constructor(a, b, c, location){
    this.a = a;
    this.b = b;
    this.c = c;
    this.location = location;
  }
}

export default class ProceduralRoads{
  constructor(city, options){
    this.city = city;
    this.population = options.population;
    this.terrain = options.terrain;

    this.placed = [];
    this.pending = [];
    this.crossings = [];

    this.road_limit = 100;
    this.road_scalar = 0.1;

    this.pointsGeometry = new THREE.Geometry();
    this.crossingsGeometry = new THREE.Geometry();

    this.pointsMesh = new THREE.Points();
    this.crossingsMesh = new THREE.Points();
    this.lineSegmentsMesh = new THREE.LineSegments();
  }

  setup(){
    this.build();
    this.setupLineSegments();
    this.setupPointsMesh();
    this.setupCrossingsMesh();
    // this.setupDebugText();
  }

  setupPointsMesh(){
    let material = new THREE.PointsMaterial( {
      color: 'blue',
      size: 12,
      sizeAttenuation: false,
      depthTest: false
    });

    for(let a of this.placed){
      this.pointsGeometry.vertices.push(a.node);
    }

    this.pointsMesh = new THREE.Points(this.pointsGeometry, material);
    this.city.scene.add(this.pointsMesh);
  }

  setupCrossingsMesh(){
    let material = new THREE.PointsMaterial( {
      color: 'red',
      size: 7,
      sizeAttenuation: false,
      depthTest: false
    });

    for(let a of this.crossings){
      this.crossingsGeometry.vertices.push(a);
    }

    this.crossingsMesh = new THREE.Points(this.crossingsGeometry, material);
    this.city.scene.add(this.crossingsMesh);
  }

  setupLineSegments(){
    this.lineGeometry = new THREE.BufferGeometry();
    let points = [];

    for(let a of this.placed){
      for(let b of a.siblings){
        if(b.prev){
          points.push(a.node.x,a.node.y,a.node.z,b.node.x,b.node.y,b.node.z);
        }
      }
    }

    this.lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute( points, 3 ) );
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 'yellow',
      linewidth: 2
    });
    this.lineSegmentsMesh = new THREE.LineSegments(this.lineGeometry,this.lineMaterial);
    this.city.scene.add(this.lineSegmentsMesh);
  }

  setupDebugText(){
    //TODO: this is not especially useful. it would be nice to have billboarding
    for(let i = 0; i < this.placed.length; i++){
      let bm = document.createElement('canvas');
      var g = bm.getContext('2d');
      bm.width = 128;
      bm.height = 128;
      g.font = "Bold 18px Arial";
      g.fillStyle = 'white';
      g.fillText(i, 60, 20);

      let tex = new THREE.Texture(bm);
      tex.needsUpdate = true;

      let geometry = new THREE.PlaneBufferGeometry( 0.1,0.1 );
      let material = new THREE.MeshBasicMaterial({ map: tex, transparent: true });

      let quad = new THREE.Mesh( geometry, material );
      let n = this.placed[i].node;
      quad.position.set(n.x,n.y,n.z + 0.01);
      this.city.manager.scene.add( quad );
    }
  }

  /**
  * builds the collection of roads.
  */
  build(){
    let map_center = new THREE.Vector3(0,0,0);

    let initial = new Road(0, null, map_center);

    this.pending.push(initial);

    while(this.pending.length > 0){
      this.pending.sort((a, b)=>{
        return a.it - b.it;
      });

      let a = this.pending[0];

      let accepted = this.localConstraints(a);

      if(accepted){
        if(a.prev){
          a.prev.siblings.push(a);
        }

        this.placed.push(a);
        this.pending.shift();

        let mode = 1;

        for(let b of this.globalGoals(a, mode)){
          this.pending.push(b);
        }
      }else{
        this.pending.shift();
      }
    }
  }

  /**
  * Local constraints checks a for certain qualities. If it passes critical
  * tests, a is confirmed and placed into the 'placed' array.
  * @param {Road} a - the current unconfirmed road.
  * @returns {Bool} returns true if a has passed critical constraints.
  */
  localConstraints(a){
    if(!a.prev){ return true; }

    let crossings = this.checkForCrossings(a);
    let dedupe = this.checkForDuplicates(a);
    let elevate = this.checkForElevation(a);

    return dedupe && elevate;
  }

  /**
  * Checks for any intersections between a and any placed road. A is truncated
  * to the closest intersection if an intersection is found.
  * @param {Road} a - the current road, recently having passed localConstraints.
  * @returns {Bool} returns true if an intersection is found, false if not.
  *
  * ISSUES:
  *   currently recognzing all intersections, but not choosing the correct one.
  */
  checkForCrossings(a){
    let crossings = [];

    for(let b of this.placed){
      if (!b.prev || a.prev.node == b.prev.node || a.prev.node == b.node) { continue; }

      let c = b.prev;

      let intersect = ASMATH.getLineIntersection(a.prev.node, a.node, b.node, c.node);

      if(intersect){
        this.crossings.push(intersect);
        crossings.push(new Crossing(a, b, c, intersect));
      }
    }

    if(crossings.length > 0){
      crossings.sort((A,B)=>{
        return (
          a.prev.node.distanceToSquared(A.location) - a.prev.node.distanceToSquared(B.location)
        );
      });

      let match = crossings[0];

      a.node = match.location;
      // TODO: set siblings once a crossing is found

      return true;
    }

    return false;
  }

  /**
  * Checks for any roads that duplicate the end point of Road a. If there is a
  * duplicate, a will be rejected, and a.prev will be bound to the match.
  * @param {Road} a - the current road, recently having passed localConstraints.
  * @returns {Bool} returns success value.
  */
  checkForDuplicates(a){
    let ok = true;

    for(let b of this.placed){
      if(b.prev){
        if(a.node.distanceTo(b.node) == 0){
          a.prev.addSibling(b);

          for(let sib in a.siblings){
            b.addSibling(sib);
          }

          console.warn("duplicate found, a has failed.");
          ok = false;
          break;
        }
      }
    }

    return ok;
  }

  /**
  * TODO: considering moving this to a post-build stage. I think that what might
  * be *best* is to actually move it to globalGoals. ok maybe I just should
  *
  * Checks for elevation. If it is too steep, it will be rejected. If not, the
  * a.z value will be defined.
  * @param {Road} a - the current road, recently having passed localConstraints.
  * @param {Float} thresh - the maximum incline allowed
  * @returns {Bool} returns success value.
  */
  checkForElevation(a){
    let ok = true;

    // I don't think I need to sample elevation from the map, but rather from
    // terrain mesh itself, using THREE.Raycaster

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3(0,0,1);

    // FIXME: currently miscalculating
    raycaster.set(a.node, direction);
    let intersects = raycaster.intersectObject(this.terrain.mesh);

    if(intersects.length > 0){
      let pI = intersects[0].point;
      a.node = pI;
    }

    return ok;
  }

  /**
  * Global Goals generate new Roads from one accepted/placed Road.
  * @param {Road} a - the current road, recently having passed localConstraints.
  * @param {Float} mode - (0) angle, (1) population
  * @returns {Array} returns array of new Roads.
  */
  globalGoals(a, mode){
    switch (mode) {
      case 0:
        return this.angleGoal(a, 20, 90);
      case 1:
        return this.populationGoal(a, 60);
    }
  }

  /**
  * A Global Goal following an angular constraint.
  * @param {Road} a - the current road, recently having passed localConstraints.
  * @param {Float} range - the maximum randomness around the chosen angle.
  * @param {Float} tendency - the angle chosen before randomness.
  * @returns {Array} returns array of new Roads.
  */
  angleGoal(a, range, tendency){
    let t_pending = [];

    let max_goals = 2;

    (this.placed.length < this.road_limit) ? max_goals = 2 : max_goals = 0;

    let quadrants = [1,2,3]; // i dont think it should be 4

    ASMATH.shuffle(quadrants);

    for(let i = 0; i < max_goals; i++){

      if(a.prev){ // generate random angle
        let new_direction = new THREE.Vector3().subVectors(a.node,a.prev.node).normalize();

        let angle = THREE.Math.randFloat((tendency * quadrants[i]) - range,(tendency * quadrants[i]) + range);

        new_direction.applyAxisAngle(new THREE.Vector3(0,0,1), angle * Math.PI/180);

        let scalar = new THREE.Vector3(this.road_scalar,this.road_scalar,this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let endpoint = new THREE.Vector3().addVectors(a.node, new_node);

        if(this.terrain.globalBoundsCheck(endpoint)){
          let new_road = new Road(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }
      }else{ // define default point
        let new_direction = new THREE.Vector3(
          THREE.Math.randFloat(-1,1),
          THREE.Math.randFloat(-1,1),
          0
        ).normalize();

        let scalar = new THREE.Vector3(this.road_scalar,this.road_scalar,this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let endpoint = new THREE.Vector3().addVectors(a.node, new_node);

        if(this.terrain.globalBoundsCheck(endpoint)){
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
  * @param {Float} range - the maximum randomness to cast rays.
  * @returns {Array} returns array of new Roads.
  */
  populationGoal(a, range){
    let t_pending = [];

    let numSample = 3; // parameterize
    let max_goals = 2; // parameterize
    let numRays = 3; // parameterize

    (this.placed.length < this.road_limit) ? max_goals = 2 : max_goals = 0;

    for(let i = 0; i < max_goals; i++){
      if(a.prev){
        let t_ray = new THREE.Line3();
        let t_sum = 0;

        for(let i = 0; i < numRays; i++){
          let ray = new THREE.Line3();
          let sum = 0;

          let angle = THREE.Math.randFloat(-range,range);

          let direction = new THREE.Vector3();
          direction.subVectors(a.node,a.prev.node).normalize();
          direction.applyAxisAngle(new THREE.Vector3(0,0,1), angle * Math.PI/180);

          let scalar = new THREE.Vector3(
            this.road_scalar,
            this.road_scalar,
            this.road_scalar
          );

          let t_end = new THREE.Vector3();
          t_end.addVectors(a.node, direction.multiply(scalar));

          ray.set(a.prev.node, t_end);

          for(let j = 0; j <= numSample; j++){
            let samp = ray.at((1.0/numSample)*j);

            if(this.terrain.globalBoundsCheck(samp)){
              sum += this.population.getSample(samp.x * this.population.width,samp.y * this.population.height);
            }
          }

          if(sum > t_sum){
            t_sum = sum;
            t_ray = ray;
          }
        }

        const endpoint = t_ray.at(1);

        if(this.terrain.globalBoundsCheck(endpoint)){
          t_pending.push(new Road(a.it + 1, a, endpoint));
        }
      }else{
        let direction = new THREE.Vector3(
          THREE.Math.randFloat(-1,1),
          THREE.Math.randFloat(-1,1),
          0
        ).normalize();

        let scalar = new THREE.Vector3(
          this.road_scalar,
          this.road_scalar,
          this.road_scalar
        );

        const endpoint = new THREE.Vector3().addVectors(a.node, direction.multiply(scalar));

        if(this.terrain.globalBoundsCheck(endpoint)){
          let new_road = new Road(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }
      }
    }

    return t_pending;
  }
}
