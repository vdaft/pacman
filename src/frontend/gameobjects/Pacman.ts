import {GameObject} from "./GameObject";
import {Game} from "../Game";

export class Pacman extends GameObject {
    protected createTexture(): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');

        canvas.width = Game.TILE_SIZE;
        canvas.height = Game.TILE_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');

        ctx.fillStyle = '#ff0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return ctx;
    }
}