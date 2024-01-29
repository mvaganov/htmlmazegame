class Wire {
	constructor() { }
	draw(ctx) {
		this.drawAlgorithm(ctx);
	}
	drawLine(ctx) {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.thickness;
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
	}
	drawCircle(ctx) {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.thickness;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
	line(start, end, color = "black", thickness = 1) {
		this.start = start; this.end = end; this.color = color; this.thickness = thickness;
		this.drawAlgorithm = this.drawLine;
	}
	circle(center, radius, color = "black", thickness = 1) {
		this.position = center; this.radius = radius; this.color = color; this.thickness = thickness;
		this.drawAlgorithm = this.drawCircle;
	}
}

class Wires {
	constructor() {
		this.wires = {};
	}
	make(name) {
		let found = this.wires[name];
		if (found) { return found; }
		found = new Wire()
		found.name = name;
		this.wires[name] = found;
		return found;
	}
	draw(ctx) {
		for (const [key, value] of Object.entries(this.wires)) {
			if (key.hidden) { continue; }
			value.draw(ctx);
		}
	}
}
