class Circle {
	constructor(center, radius) {
		this.center = center;
		this.radius = radius;
	}
}

Circle.prototype.toString = function() {
	return "(" + this.center.x.toFixed(2) + "," + this.center.y.toFixed(2) + ":" + this.radius.toFixed(2) + ")";
};
