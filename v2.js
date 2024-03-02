class V2 {
	constructor(x = 0, y = undefined) {
		if (x === 0 && y === undefined) {
			this.x = 0; this.y = 0;
		} else if (y === undefined && typeof x === "object") {
			this.x = x.x; this.y = x.y;
		} else {
			this.x = x; this.y = y;
		}
		this.assert();
	}
	static zero = new V2();
	isZero() { return this.x === 0 && this.y === 0; }
	assert() { if (this.x === undefined || this.y === undefined) { throw new Error("undefined values! " + this.toString()); } }
	set(x,y) {
		if (typeof x === "object" && y === undefined) { this.x = x.x; this.y = x.y; }
		else { this.x = x; this.y = y; this.assert(); return this; }
	}
	copy(v) { this.x = v.x; this.y = v.y; this.assert(); return this; }
	add(v) { this.x += v.x; this.y += v.y; this.assert(); return this; }
	sub(v) { this.x -= v.x; this.y -= v.y; this.assert(); return this; }
	mul(v) {
		       if (typeof v === "object") {
			this.x *= v.x; this.y *= v.y;
		} else if (typeof v === "number") {
			this.x *= v; this.y *= v;
		}
		this.assert();
		return this;
	}
	div(v) {
		       if (typeof v === "object") {
			this.x /= v.x; this.y /= v.y;
		} else if (typeof v === "number") {
			this.x /= v; this.y /= v;
		}
		this.assert();
		return this;
	}
	magnitudeSq() { return this.x * this.x + this.y * this.y; }
	magnitude() { return Math.sqrt(this.magnitudeSq()); }
	normalized() { let mag = this.magnitude(); return new V2(this.x / mag, this.y / mag); }
	area() { return this.x*this.y; }
	static sum(a, b) { return new V2(a.x + b.x, a.y + b.y); }
	static diff(a, b) { return new V2(a.x - b.x, a.y - b.y); }
	static dot(a, b) { return a.x * b.x + a.y * b.y; }
	static sign(a, b) { return a.x * b.y - a.y * b.x; }
	static isNan(v) { return !v.x || !v.y; }
	static prod(a, b) {
		       if (typeof a === "object" && typeof b === "object") {
			return new V2(a.x * b.x, a.y * b.y);
		} else if (typeof a === "object" && typeof b === "number") {
			return new V2(a.x * b, a.y * b);
		} else if (typeof b === "object" && typeof a === "number") {
			return new V2(b.x * a, b.y * a);
		}
		throw "can't multiply "+(typeof a)+" and "+(typeof b);
	}
	static quotient(a, b) {
		       if (typeof a === "object" && typeof b === "object") {
			return new V2(a.x / b.x, a.y / b.y);
		} else if (typeof a === "object" && typeof b === "number") {
			return new V2(a.x / b, a.y / b);
		}
		return this;
	}
	static lerp(a, b, p) {
		let dx = b.x - a.x;
		let dy = b.y - a.y;
		return new V2(a.x + (dx * p), a.y + (dy * p));
	}
	static distance(a, b) {
		let x = a.x-b.x;
		let y = a.y-b.y;
		return Math.sqrt(x*x+y*y);
	}
}

V2.prototype.toString = function() {
	return "("+this.x+","+this.y+")";
};
