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
    this.population = options.population;
    this.terrain = options.terrain;

    this.placed = [];
    this.pending = [];
    this.crossings = [];

    this.road_limit = 100;
    this.road_scalar = 0.05;

    this.pointsGeometry = new THREE.Geometry();
    this.crossingsGeometry = new THREE.Geometry();

    this.pointsMesh = new THREE.Points();
    this.crossingsMesh = new THREE.Points();
    this.lineSegmentsMesh = new THREE.LineSegments();
  }

  /**
  * Describe the method
  * @param {Type} description.
  */
  setup(){
    this.generate();
    this.setupLineSegments();
    this.setupPointsMesh();
    this.setupCrossingsMesh();
  }

  setupPointsMesh(){
    let material = new THREE.PointsMaterial( {
      color: 'blue',
      size: 12,
      sizeAttenuation: false,
      transparent: true
    });

    for(let a of this.placed){
      this.pointsGeometry.vertices.push(a.node);
    }

    this.pointsMesh = new THREE.Points(this.pointsGeometry, material);
  }

  setupCrossingsMesh(){
    let material = new THREE.PointsMaterial( {
      color: 'red',
      size: 7,
      sizeAttenuation: false,
      transparent: true
    });

    for(let a of this.crossings){
      this.crossingsGeometry.vertices.push(a);
    }

    this.crossingsMesh = new THREE.Points(this.crossingsGeometry, material);
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
  }

  generate(){
    let map_center = new THREE.Vector3(0,0,0);

    let initial = new Road(0, null, map_center);

    this.pending.push(initial);

    while(this.pending.length > 0){
      this.pending.sort((a, b)=>{
        return a.it < b.it;
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

  localConstraints(a){
    return true;

    if(!a.prev){ return true; }

    let crossings = this.checkForCrossings(a);
    let dedupe = this.checkForDuplicates(a);

    return dedupe;
  }

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
        return (a.prev.node.distanceTo(A.location) > a.prev.node.distanceTo(B.location));
      });

      let match = crossings[0];

      a.node = match.location;
      // set siblings

      return true;
    }

    return false;
  }

  checkForDuplicates(a){ return true; }

  globalGoals(a, mode){
    switch (mode) {
      case 0:
        return this.angleGoal(a, 20, 90);
      case 1:
        return this.populationGoal(a, 60, 3);
    }
  }

  /**
  * A Global Goal following an angular constraint.
  * @param {Type} description.
  */
  angleGoal(a, range, tendency){
    let t_pending = [];

    let max_goals = 2;

    (this.placed.length < this.road_limit) ? max_goals = 2 : max_goals = 0;

    let quadrants = [1,2,3]; // i dont think it should be 4

    ASMATH.shuffle(quadrants);

    for(let i = 0; i < max_goals; i++){

      if(a.prev){
        let new_direction = new THREE.Vector3().subVectors(a.node,a.prev.node).normalize();

        let angle = THREE.Math.randFloat((tendency * quadrants[i]) - range,(tendency * quadrants[i]) + range);

        new_direction.applyAxisAngle(new THREE.Vector3(0,0,1), angle * Math.PI/180);

        let scalar = new THREE.Vector3(this.road_scalar,this.road_scalar,this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let end = new THREE.Vector3().addVectors(a.node, new_node);

        if(this.terrain.globalBoundsCheck(end)){
          let new_road = new Road(a.it + 1, a, end);
          t_pending.push(new_road);
        }
      }else{ // define default point
        let new_direction = new THREE.Vector3(THREE.Math.randFloat(-1,1),THREE.Math.randFloat(-1,1),0).normalize();

        let scalar = new THREE.Vector3(this.road_scalar,this.road_scalar,this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let end = new THREE.Vector3().addVectors(a.node, new_node);

        console.log("TERRAIN", this.terrain);

        if(this.terrain.globalBoundsCheck(end)){
          let new_road = new Road(a.it + 1, a, end);
          t_pending.push(new_road);
        }

        break;
      }
    }

    return t_pending;
  }

  /**
  * A Global Goal following a population map.
  * @param {Type} description.
  */
  populationGoal(a, range, numRays){ // TODO
    let t_pending = [];

    let numSample = 3;
    let max_goals = 2;

    (this.placed.length < this.road_limit) ? max_goals = 2 : max_goals = 0;

    for(let i = 0; i < max_goals; i++){
      if(a.prev){
        let t_ray = new THREE.Line3();
        let t_sum = 0;

        for(let i = 0; i < numRays; i++){
          let ray = new THREE.Line3();
          let sum = 0;

          let direction = new THREE.Vector3();
          direction.subVectors(a.node,a.prev.node).normalize();

          let random_angle = THREE.Math.randFloat(-range,range);
          direction.applyAxisAngle(new THREE.Vector3(0,0,1),random_angle);

          let scalar = new THREE.Vector3(
            this.road_scalar,
            this.road_scalar,
            this.road_scalar
          );

          let t_end = new THREE.Vector3();
          t_end.addVectors(a.node,direction.multiply(scalar).add(a.node));

          ray.set(a.prev.node,t_end);

          for(let j = 0; j < numSample; j++){
            let samp = ray.at((1.0/3)*j);
            console.log("samp",samp);
            /*
              A few things:

                why are so many samples (0,0,0)?

                the map is using pixel width/height, not normalized, so I need
                to think of the appropriate way to scale the sample coords
            */
            if(this.terrain.globalBoundsCheck(samp)){
              sum += this.population.getSample(samp.x * this.population.width,samp.y * this.population.height);
            }
          }

          if(sum > t_sum){
            t_sum = sum;
            t_ray = ray;
          }
        }

        let end = t_ray.at(1);

        if(this.terrain.globalBoundsCheck(end)){
          t_pending.push(new Road(a.it + 1, a, end));
        }
      }else{
        let new_direction = new THREE.Vector3(THREE.Math.randFloat(-1,1),THREE.Math.randFloat(-1,1),0).normalize();

        let scalar = new THREE.Vector3(this.road_scalar,this.road_scalar,this.road_scalar);
        let new_node = new THREE.Vector3().multiplyVectors(new_direction, scalar);

        let end = new THREE.Vector3().addVectors(a.node, new_node);

        if(this.terrain.globalBoundsCheck(end)){
          let new_road = new Road(a.it + 1, a, end);
          t_pending.push(new_road);
        }
      }
    }

    return t_pending;
  }
}
