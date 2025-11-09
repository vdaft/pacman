import {GameObject} from "./GameObject";
import {Game} from "../Game";

export class Wall extends GameObject {
    protected createTexture(): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.width = Game.TILE_SIZE;
        canvas.height = Game.TILE_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context');
        }

        ctx.fillStyle = "#00f"
        ctx.fillRect(0, 0, Game.TILE_SIZE, Game.TILE_SIZE);

        return ctx;
    }
}