import * as THREE from "three";

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

  return false;
}

module.exports = {
  shuffle,
  getLineIntersection
}
