import {Level} from "./Level";
import {Game} from "./Game";

export class Renderer {
    scene: [];
    canvas: HTMLCanvasElement;

    constructor(protected ctx: CanvasRenderingContext2D) {
        this.scene = [];
        this.canvas = ctx.canvas;
    }

    render(level: Level) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const gameObject of level.objects) {
            this.ctx.drawImage(gameObject.texture, gameObject.position.x * Game.TILE_SIZE, gameObject.position.y * Game.TILE_SIZE);
        }
    }
}