class SpeechBubble {
	static circle32 = [];
	constructor(text, getSourcePointFunc, getBubblePointFunc, lineColor, duration) {
		this.text = text;
		this.getSourcePointFunc = getSourcePointFunc;
		this.getBubblePointFunc = getBubblePointFunc;
		this.lineColor = lineColor;
		this.duration = duration;
		if (SpeechBubble.circle32.length == 0) {
			for (let i = 0; i < Math.PI * 2; i += Math.PI/16) {
				SpeechBubble.circle32.push(new V2(Math.cos(i)/2, Math.sin(i)/2));
			}
		}
	}

	static updateSpeechBubbles(deltaTime, bubbles) {
		for (let i = bubbles.length - 1; i >= 0; --i) {
			let bubble = bubbles[i];
			bubble.update(deltaTime);
			// if (bubble.done) {
			// 	bubbles.splice(i, 1);
			// }
		}
	}

	static drawSpeechBubbles(ctx, bubbles) {
		for (let i = 0; i < bubbles.length; ++i) {
			let bubble = bubbles[i];
			if (bubble.duration <= 0) {
				continue;
			}
			bubble.draw(ctx);
		}
	}

	update(deltaTime) {
		this.duration -= deltaTime;
		if (this.duration <= 0) {
			this.done = true;
		}
	}

	draw(ctx) {
		let speechSource = this.getSourcePointFunc();
		let center = this.getBubblePointFunc();
		let alphaDuration = 255;
		if (this.duration) {
			if (this.duration <= 0) {
				return;
			}
			alphaDuration = Math.trunc(this.duration*250);
			if (alphaDuration >= 256) {
				alphaDuration = 255;
			} else if (alphaDuration < 0) {
				alphaDuration = 0;
			}
		}
		let alpha = alphaDuration.toString(16).padStart(2, '0');
		this.speechBubble(ctx, this.text, center, speechSource, this.lineColor+alpha, '#ffffff'+alpha, '#222222'+alpha);
	}

	speechBubble(ctx, text, position, speechSource, bubbleLine = '#888', bubbleColor = '#fffa', textColor = '#222') {
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		let metrics = ctx.measureText(text);
		let line = text.split("\n");
		let totalRect = new V2(0,0);
		let lineRects = [];
		let lineSpacing = 5;
		for(let i = 0; i < line.length; i++) {
			if (i > 0) {
				totalRect.y += lineSpacing;
			}
			let lineSize = this.getTextRectSize(ctx, line[i]);
			lineRects.push(lineSize);
			if (totalRect.x < lineSize.x) {
				totalRect.x = lineSize.x;
			}
			totalRect.y += lineSize.y;
		}
		let p = new V2(position);
		let extraSize = V2.prod(totalRect, 0.25);
		totalRect.add(extraSize);
		ctx.strokeStyle = bubbleLine;
		ctx.fillStyle = bubbleColor;
		this.drawOvalWordBubble(ctx, p, totalRect, speechSource);
		p.y += extraSize.y/2;
		let cursor = V2.diff(p, new V2(0, totalRect.y/2));
		const descentOffset = metrics.fontBoundingBoxDescent/2;
		for (let i = 0; i < line.length; ++i) {
			let lineSize = lineRects[i];//getTextRectSize(ctx, line[i]);
			// ctx.strokeStyle = '#fff4';
			// ctx.fillStyle = "#fff";
			// ctx.beginPath();
			// ctx.rect(cursor.x - lineSize.x/2, cursor.y + descentOffset, lineSize.x, lineSize.y);
			// ctx.fill();
			// ctx.stroke();
			ctx.fillStyle = textColor;
			ctx.fillText(line[i], cursor.x, cursor.y + lineSize.y);
			cursor.y += lineSize.y + lineSpacing;
		}
	}

	getTextRectSize(ctx, text) {
		let metrics = ctx.measureText(text);
		let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
		let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		let actualWidth = ctx.measureText(text).width;
		return new V2(actualWidth, actualHeight);
	}


	drawOvalWordBubble(ctx, center, size, source, precomputedVerts) {
		if (!precomputedVerts) {
			precomputedVerts = this.calculateOvalWordBubble(center, size, source);
		}
		ctx.beginPath();
		let vert = precomputedVerts[0];
		ctx.moveTo(vert.x, vert.y)
		for (let i = 1; i < precomputedVerts.length; i++) {
			vert = precomputedVerts[i];
			ctx.lineTo(vert.x, vert.y);
		}
		ctx.fill();
		ctx.stroke();
	}

	calculateOvalWordBubble(center, size, source) {
		let points = [];
		let last = SpeechBubble.circle32.length-1;
		let x = SpeechBubble.circle32[last].x * size.x;
		let y = SpeechBubble.circle32[last].y * size.y;
		points.push(new V2(x + center.x,y + center.y));
		let lastPoint = new V2(x,y);
		let thisPoint = new V2(x,y);
		let toSource = V2.diff(source, center);
		let lastSign = V2.sign(toSource, thisPoint) > 0;
		for(let i = 0; i < 32; ++i) {
			x = SpeechBubble.circle32[i].x * size.x;
			y = SpeechBubble.circle32[i].y * size.y;
			thisPoint.set(x,y);
			let thisSign = V2.sign(toSource, thisPoint) > 0;
			if (lastSign != thisSign && V2.dot(thisPoint, toSource) > 0) {
				points.push(source);
			}
			lastSign = thisSign;
			points.push(new V2(x + center.x, y + center.y));
			lastPoint.set(x, y);
		}
		return points;
	}
}
