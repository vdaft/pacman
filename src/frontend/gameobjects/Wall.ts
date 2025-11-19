import {GameObject} from "./GameObject";
import {Game} from "../Game";
import {Vector2Like} from "../types";

export class Wall extends GameObject {
    constructor(position: Vector2Like, public color: string = "#0000ff") {
        super(position);
    }

    createTexture(): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.width = Game.TILE_SIZE;
        canvas.height = Game.TILE_SIZE;

        console.log(Game.TILE_SIZE);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context');
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, Game.TILE_SIZE, Game.TILE_SIZE);

        return ctx;
    }
}