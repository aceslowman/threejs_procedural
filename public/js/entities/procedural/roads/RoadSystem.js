import * as THREE from 'three';
import * as ASMATH from '../../../utilities/Math';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

import Node from './Node';
import NodeCrossing from './NodeCrossing';

/*
  TODO: reject roads too close together

  FIXME: under certain conditions, some roads might be orphaned, particularly
  where it intersects.

  FIXME: elevate() results in odd roads being drawn to crossings (which are
  anchored to z)

  FIXME: somewhere, there are siblings not being removed, resulting in orphaned
  nodes existing in siblings. I believe this is due to removeDuplicates().
  it means something that was rejected didn't get removed from siblings.
*/

export default class RoadSystem {
  constructor(world, terrain) {
    this.world      = world;
    this.terrain    = terrain;
    this.population = this.terrain.elevation;

    this.placed    = [];
    this.pending   = [];
    this.crossings = [];

    this.road_limit  = 50;
    this.road_scalar = 50;

    this.geometry = {
      points: new THREE.Geometry(),
      crossings: new THREE.Geometry()
    };

    this.mesh = {
      points: new THREE.Points(),
      crossings: new THREE.Points(),
      lineSegments: new THREE.LineSegments()
    };

    this.debug = {
      verbose: true,
      chooser: {
        id: null,
        objects: []
      }
    };
  }

  setup() {
    this.build();
    this.elevate();
    this.setupDebug();
  }

  build() {
    this.pending.push(new Node(0, null, new THREE.Vector3(0, 0, 0)));

    while (this.pending.length > 0) {
      this.pending.sort((a, b) => {
        return a.it - b.it;
      });

      let a = this.pending[0];

      let accepted = this.localConstraints(a);

      if (accepted) {
        if (a.prev) {
          a.prev.connect(a);
          a.connect(a.prev);
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

  elevate() {
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

  // ---------------------------------------------------------------------------

  localConstraints(a) {
    if (!a.prev) return true;

    this.trimToCrossing(a, 50);
    let valid = this.removeDuplicates(a, 10);

    if(!valid){
      // TEMP: this shouldn't be necessary.
      for(let b of this.placed){
        b.sever(a);
      }
    }

    return valid;
  }

  trimToCrossing(a, thresh) {
    let crossings = [];

    for (let b of this.placed) {
      if(a.prev == b){ continue; }

      for(let c of b.siblings){
        if(a.prev == c){ continue; }

        // TEMP: I need a better way to set bounds
        let limit = this.terrain.width;
        let ray = new THREE.Vector3().subVectors(a.node,a.prev.node);
        ray.multiplyScalar(limit).add(a.node);

        let intersection = ASMATH.getLineIntersection(
          a.prev.node,
          ray,
          b.node,
          c.node
        );

        if(intersection){
          crossings.push(new NodeCrossing(a, b, c, intersection));
        }
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

      // check to see if the match actually intersects
      let intersects = ASMATH.getLineIntersection(
        a.prev.node,
        a.node,
        match.b.node,
        match.c.node
      );

      let within_thresh = a.node.distanceToSquared(match.location) < thresh;

      if(intersects || within_thresh){
        this.crossings.push(match.location);

        // move (a) to the NodeCrossing location
        a.node = match.location;

        // sever siblings
        match.b.sever(match.c);
        match.b.connect(a); // NOTE: related to orphan bug
        match.c.connect(a); // NOTE: related to orphan bug
      }
    }
  }

  // FIXME: I am currently removing a from all after rejection, but
  removeDuplicates(a, thresh) {
    let ok = true;

    for (let b of this.placed) {
      if(a.prev == b){ continue; }

      if (a.node.distanceTo(b.node) <= thresh) {
        a.prev.connect(b);
        b.sever(a);

        for (let sib of a.siblings) {
          a.sever(sib);
          b.connect(sib);
        }

        ok = false;
        break;
      }
    }

    return ok;
  }

  // ---------------------------------------------------------------------------

  globalGoals(a, mode) {
    mode = 1;

    switch (mode) {
      case 0:
        return this.angleGoal(a, 0, 90);
      case 1:
        return this.populationGoal(a, 90);
    }
  }

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
          let new_road = new Node(a.it + 1, a, endpoint);
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
          let new_road = new Node(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }

        break;
      }
    }

    return t_pending;
  }

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
            console.error('Major failure, you may be incorrectly sampling the population map.', endpoint);
          }

          t_pending.push(new Node(a.it + 1, a, endpoint));
        }

      } else {

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
          let new_road = new Node(a.it + 1, a, endpoint);
          t_pending.push(new_road);
        }
      }
    }

    return t_pending;
  }

  // ---------------------------------------------------------------------------

  setupDebug() {
    for (let a of this.placed) {
      this.geometry.points.vertices.push(a.node);
      this.geometry.points.colors.push(new THREE.Color(0,0,1));
    }

    this.geometry.points.colorsNeedUpdate = true;

    this.mesh.points = new THREE.Points(this.geometry.points, new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size: 12,
      sizeAttenuation: false,
      depthTest: false
    }));

    for (let a of this.crossings) {
      this.geometry.crossings.vertices.push(a);
    }

    this.mesh.crossings = new THREE.Points(this.geometry.crossings, new THREE.PointsMaterial({
      color: 'red',
      size: 7,
      sizeAttenuation: false,
      depthTest: false
    }));

    let points = [];

    // core build loop for lineGeometry
    for (let a of this.placed) {
      for (let b of a.siblings) {
        if (b.prev) {
          points.push(a.node.x, a.node.y, a.node.z, b.node.x, b.node.y, b.node.z);
        }
      }
    }

    let lineGeometry = new THREE.BufferGeometry();
    lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    this.mesh.lineSegments = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
      color: 'black',
      linewidth: 2.0,
      depthTest: false
    }));

    this.mesh.lineSegments.renderOrder = 30;

    this.mesh.points.renderOrder = 100;
    this.mesh.crossings.renderOrder = 100;

    this.world.manager.scene.add(this.mesh.lineSegments);
    this.world.manager.scene.add(this.mesh.points);
    this.world.manager.scene.add(this.mesh.crossings);

    //TODO: this is not especially useful. it would be nice to have billboarding
    for (let i = 0; i < this.placed.length; i++) {
      let cont = document.createElement('div');
      let label = document.createElement('h6');
      label.appendChild(document.createTextNode(i));

      cont.appendChild(label);
      cont.classList.add('road_label');
      cont.id = i;

      document.body.appendChild(cont);
    }

    this.debug_elements = document.getElementsByClassName('road_label');
  }

  updateDebug() {
    for (let i = 0; i < this.debug_elements.length; i++) {
      let element = this.debug_elements[i];
      let manager = this.world.manager;

      let node = this.placed[element.id].node;
      let cam = manager.camera.getCamera();
      let canvas = manager.renderer.context.canvas;

      let loc = ASMATH.world2Screen(node, cam, canvas);

      element.style.left = (loc.x - 15) + 'px';
      element.style.top = (loc.y + 5) + 'px';
    }
  }

  updateMousePicker(mouse, block_chooser, show_textbox) {
    let camera = this.world.manager.camera.getCamera();

    // first, check for Node intersections.
    this.world.raycaster.setFromCamera(mouse, camera);

    let intersects_road = this.world.raycaster.intersectObject(this.mesh.points, true);

    if(intersects_road.length > 0){
      if(this.debug.chooser.id != intersects_road[0].index){
        this.debug.chooser.id = intersects_road[0].index;
        this.mesh.points.geometry.colors[this.debug.chooser.id] = new THREE.Color('orange');
        this.mesh.points.geometry.colorsNeedUpdate = true;

        // create line to all siblings
        for(let sib of this.placed[this.debug.chooser.id].siblings){
          let geo = new THREE.Geometry();
          geo.vertices.push(this.placed[this.debug.chooser.id].node, sib.node);

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
          this.debug.chooser.objects.push(meshline);
          this.world.manager.scene.add(meshline);
        }

        // create line to prev node
        if(this.placed[this.debug.chooser.id].prev){
          let geo = new THREE.Geometry();
          geo.vertices.push(this.placed[this.debug.chooser.id].node, this.placed[this.debug.chooser.id].prev.node);

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
          this.debug.chooser.objects.push(meshline);
          this.world.manager.scene.add(meshline);
        }

        // display text box with full information
        if(show_textbox){
          let container = document.createElement('div');
          container.appendChild(document.createTextNode('Siblings: '));

          let sib_ul = document.createElement('ul');

          for(let sib of this.placed[this.debug.chooser.id].siblings){
            let sib_li = document.createElement('li');
            sib_li.innerHTML = sib.id;
            sib_ul.appendChild(sib_li);
          }

          container.appendChild(sib_ul);

          container.appendChild(document.createTextNode('Previous: ' + this.placed[this.debug.chooser.id].prev.id));

          container.classList.add('road_textbox');
          container.id = 't'+this.debug.chooser.id;
          container.style.backgroundColor = 'black';
          container.style.position = 'absolute';
          container.style.padding = '15px';
          container.style.margin = '15px';
          container.style.border = '1px solid white';

          container.style.left = '0px';
          container.style.top = '0px';
          container.style.zIndex = 200000;

          document.body.appendChild(container);
        }
      }
    } else {
      if(this.debug.chooser.id != null){
        if(show_textbox){
          document.getElementById('t'+this.debug.chooser.id).remove();
        }
        this.mesh.points.geometry.colors[this.debug.chooser.id] = new THREE.Color('blue');
        this.mesh.points.geometry.colorsNeedUpdate = true;
        this.debug.chooser.id = null;

        for(let l of this.debug.chooser.objects){
          this.world.manager.scene.remove(l);
        }

        this.debug.chooser.objects = [];
      }
    }
  }
}
