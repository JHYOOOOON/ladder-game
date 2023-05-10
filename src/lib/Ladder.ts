import { MAX_X } from "../constants";

class Ladder {
	public canvas;
	public ctx;
	private userCount;
	private startX;
	private stepSize;
	constructor(canvas: HTMLCanvasElement, userCount: number) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.userCount = userCount;
		this.startX = this.width / (userCount * 2);
		this.stepSize = (this.width - this.startX * 2) / (userCount - 1);
	}

	drawHorizontalLine(column: number, row: number) {
		const { ctx, startX, stepSize, height } = this;
		if (!ctx) return;
		ctx.beginPath();
		ctx.moveTo(startX + column * stepSize, row * (height / MAX_X));
		ctx.lineTo(startX + stepSize * (column + 1), row * (height / MAX_X));
		ctx.stroke();
	}

	drawVerticalLine(column: number, rowStart: number, rowEnd: number) {
		const { ctx, startX, stepSize } = this;
		if (!ctx) return;
		ctx.beginPath();
		ctx.moveTo(startX + column * stepSize, rowStart);
		ctx.lineTo(startX + column * stepSize, rowEnd);
		ctx.stroke();
	}

	lineWidth(lineWidth: number) {
		if (!this.ctx) return;
		this.ctx.lineWidth = lineWidth;
	}

	color(color: string) {
		if (!this.ctx) return;
		this.ctx.strokeStyle = color;
	}

	save() {
		this.ctx?.save();
	}

	restore() {
		this.ctx?.restore();
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}
}

export default Ladder;
