class AABB {
	constructor(min, max) { this.min = min; this.max = max; }
	static isInside(v, min, max) { return v.x < max.x && v.y < max.y && v.x >= min.x && v.y >= min.y; }
	size() { return new V2(this.max.x-this.min.x, this.max.y-this.min.y); }
	area() { return this.size().area(); }
	contains(v) { return AABB.isInside(v, this.min, this.max); }
	getCenter() { return new V2((this.min.x+this.max.x)/2, (this.min.y+this.max.y)/2); }
	intersectsCircle(center, radius) {
		if (this.contains(center)) { return true; }
		let radSize = new V2(radius,radius);
		let expandedMin = V2.diff(this.min, radSize);
		let expandedMax = V2.sum(this.max, radSize);
		if (AABB.isInside(center, expandedMin, expandedMax)) {
			let cornerCase = undefined;
			if (center.x < this.min.x) {
				if (center.y < this.min.y) {
					cornerCase = this.min;
				} else if (center.y > this.max.y) {
					cornerCase = new V2(this.min.x, this.max.y);
				}
			} else if (center.x > this.max.x) {
				if (center.y < this.min.y) {
					cornerCase = new V2(this.max.x, this.min.y);
				} else if (center.y > this.max.y) {
					cornerCase = this.max;
				}
			}
			if (cornerCase) {
				let distance = V2.distance(cornerCase, center);
				return distance <= radius;
			}
			return true;
		}
		return false;
	}
	intersectsRect(otherMin, otherMax) {
		if (this.min.x > otherMax.x || otherMin.x > this.max.x || this.max.y > otherMin.y || otherMax.y > this.min.y) {
			return false;
		}
		if (this.min.x == this.max.x || this.min.y == this.max.y || otherMax.x == otherMin.x || otherMin.y == otherMax.y) {
			return false;
		}
		return true;
	}
	draw(ctx) {
		let size = this.size();
		ctx.beginPath();
		ctx.rect(this.min.x, this.min.y, size.x, size.y);
		ctx.stroke();
	}
}

AABB.prototype.toString = function() {
	return "(" + this.min.x + "," + this.min.y + ":" + this.max.x + "," + this.max.y + ")";
};
