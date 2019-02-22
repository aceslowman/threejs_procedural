export default class Road {
  constructor(it, prev, end) {
    this.id       = null;
    this.node     = end;
    this.prev     = prev;
    this.siblings = [];

    this.it       = it;

    this.chosen   = false;
  }

  connect(a) {
    // connect (this) to (a)
    if(!this.siblings.includes(a) && a != this){
      this.siblings.push(a);
    }

    // connect (a) to (this)
    if(!a.siblings.includes(this) && this != a){
      a.siblings.push(this);
    }
  }

  sever(a) {
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
