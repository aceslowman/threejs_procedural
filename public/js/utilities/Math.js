import * as THREE from "three";

/**
 * Scale value from one range to another
 */
function scale(num, in_min, in_max, out_min, out_max){
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getLineIntersection(p0, p1, p2, p3){
  /*
  From Andre LeMothe's "Tricks of the Windows Game Programming Gurus"
  via https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  */
  let intersection = new THREE.Vector3();

  let s1_x, s1_y, s2_x, s2_y;
  s1_x = p1.x - p0.x;
  s1_y = p1.y - p0.y;
  s2_x = p3.x - p2.x;
  s2_y = p3.y - p2.y;

  let s, t;
  s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
  t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
    intersection.x = p0.x + (t * s1_x);
    intersection.y = p0.y + (t * s1_y);
    return intersection;
  }
}

function world2Screen(node, camera, canvas){
  let xy = node.clone().project(camera);

  xy.x = Math.round( (   xy.x + 1 ) * canvas.width  / 2 );
  xy.y = Math.round( ( - xy.y + 1 ) * canvas.height / 2 );

  return xy
}

// TODO: this should be phased out
//https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
function toScreenPosition(obj, camera, renderer){
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
};

module.exports = {
  scale,
  shuffle,
  getLineIntersection,
  toScreenPosition,
  world2Screen
}
