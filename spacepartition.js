class SpacePartition {
	constructor(min, max, minArea, columnsRows, parent = undefined) {
		this.aabb = new AABB(new V2(min), new V2(max));
		this.list = [];
		this.columnsRows = columnsRows;
		this.depth = 0;
		this.parent = parent;
		while(parent) {
			++this.depth;
			parent = parent.parent;
		}
		if (this.depth > 3) {
			return;
		}
		this.createSubPartition(minArea);
	}

	createSubPartition(minArea) {
		let columns = this.columnsRows.x;
		let rows = this.columnsRows.y;
		let size = this.aabb.size();
		let cellSize = new V2(size.x / columns, size.y / rows)
		let cellArea = cellSize.area();
		if (cellArea < minArea) {
			return;
		}
		this.subpartition = [];
		let cursor = new V2(this.aabb.min);
		for(let r = 0; r < rows; ++r) {
			cursor.x = this.aabb.min.x;
			for(let c = 0; c < columns; ++c) {
				let nextCell = new SpacePartition(cursor, V2.sum(cursor, cellSize), minArea, this.columnsRows, this);
				this.subpartition.push(nextCell);
				cursor.x += cellSize.x;
			}
			cursor.y += cellSize.y;
		}
	}

	draw(ctx, drawElementFunction) {
		this.aabb.draw(ctx);
		if (this.subpartition) {
			for(let i = 0; i < this.subpartition.length; i++) {
				this.subpartition[i].draw(ctx, drawElementFunction);
			}
		}
		let center = this.aabb.getCenter();
		//ctx.fillText(""+this.list.length, center.x, center.y);
		if (drawElementFunction){
			for (let i = 0; i < this.list.length; ++i) {
				let element = this.list[i];
				drawElementFunction(ctx, this, element);
			}
		}
	}

	getPartitions(circle) {
		if (!this.subpartition) {
			return [this];
		}
		let totalFoundPartitions = undefined;
		for(let i = 0; i < this.subpartition.length; i++) {
			let subPartition = this.subpartition[i];
			if (circle.radius) {
				if (!subPartition.aabb.intersectsCircle(circle.center, circle.radius)) { continue; }
			} else {
				if (!subPartition.aabb.contains(circle.center)) { continue; }
			}
			let foundPartitions = subPartition.getPartitions(circle);
			if (foundPartitions) {
				if (!totalFoundPartitions) { totalFoundPartitions = []; }
				totalFoundPartitions = totalFoundPartitions.concat(foundPartitions);
			}
		}
		if (totalFoundPartitions === undefined) {
			totalFoundPartitions = [this];
		}
		return totalFoundPartitions;
	}

	clearList() {
		this.list = [];
		if (this.subpartition) {
			for(let i = 0; i < this.subpartition.length; i++) {
				this.subpartition[i].clearList();
			}
		}
	}

	populate(list, convertElementToCircleMethod) {
		this.clearList();
		for (let i = 0; i < list.length; ++i) {
			let element = list[i];
			let circle = convertElementToCircleMethod(element);
			let partitions = this.getPartitions(circle);
			//console.log(element.name+" in "+partitions.length+" partitions: "+partitions[0].aabb);
			for (let p = 0; p < partitions.length; ++p) {
				let partition = partitions[p];
				partition.list.push(element);
			}
		}
	}

	getCollisions(circle, convertElementToCircleMethod) {
		let partitions = this.getPartitions(circle);
		//console.log(partitions.length);
		let collisions = undefined;
		for (let i = 0; i < partitions.length; ++i) {
			//console.log(partitions[i].list.length);
			for (let e = 0; e < partitions[i].list.length; ++e) {
				let element = partitions[i].list[e];
				if (!element) { continue; }
				let otherCircle = convertElementToCircleMethod(element);
				let targetDistance = otherCircle.radius;
				if (circle.radius) {
					targetDistance += circle.radius;
				}
				let distance = V2.distance(circle.center, otherCircle.center);
				if (distance <= targetDistance) {
					if (!collisions) { collisions = []; }
					collisions.push(element);
				}
			}
		}
		return collisions;
	}
}
