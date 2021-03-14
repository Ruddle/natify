let clamp = (x, a, b) => Math.max(a, Math.min(b, x));
let flatstep = (a, b, x) => clamp((x - a) / (b - a), 0, 1);
let ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
let smoothstep = (a, b, x) => ease(flatstep(a, b, x));
let mix = (a, b, m) => a * (1.0 - m) + b * m;

//Wrap {loop, clamp, zero}
export default class Interp {
  constructor(arr, wrap = "loop") {
    this.arr = arr;
    this.wrap = wrap;
  }

  getWrap(i) {
    if (i >= 0 && i < this.arr.length) {
      return this.arr[i];
    }

    if (this.wrap === "loop") {
      let i2 = i % this.arr.length;
      if (i2 < 0) i2 += this.arr.length;
      return this.arr[i2];
    }

    return i;
  }

  nearest(i) {
    return this.arr[Math.round(i) % this.arr.length];
  }

  linear(i) {
    let phase = i % 1;
    let k = Math.floor(i);
    return mix(this.getWrap(k), this.getWrap(k + 1), flatstep(0, 1, phase % 1));
  }

  smoothstep(i) {
    let phase = i % 1;
    let k = Math.floor(i);
    return mix(
      this.getWrap(k),
      this.getWrap(k + 1),
      smoothstep(0, 1, phase % 1)
    );
  }

  getTangent(k) {
    return (this.getWrap(k + 1) - this.getWrap(k - 1)) / 2;
  }

  cubic(t) {
    const k = Math.floor(t);
    const m = [this.getTangent(k), this.getTangent(k + 1)]; //get tangents
    const p = [this.getWrap(k), this.getWrap(k + 1)]; //get points
    //Translate t to interpolate between k and k+1
    t -= k;
    const t2 = t * t; //t^2
    const t3 = t * t2; //t^3
    //Apply cubic hermite spline formula
    return (
      (2 * t3 - 3 * t2 + 1) * p[0] +
      (t3 - 2 * t2 + t) * m[0] +
      (-2 * t3 + 3 * t2) * p[1] +
      (t3 - t2) * m[1]
    );
  }
}
