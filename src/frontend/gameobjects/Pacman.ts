import {GameObject} from "./GameObject";
import {Game} from "../Game";
import {Vector2Like} from "../types";
import {Level} from "../Level";

export class Pacman extends GameObject {
    timeUntilNextMove:number = 1
    direction: Vector2Like = {x: 0, y: 1};
    bufferedDirection: Vector2Like = {x: 0, y: 1};

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

    update(delta: number, level: Level): void {
        const isBlocked = (() => {
            const gameObject = level.getGameObjectAt(this.position.x + this.direction.x, this.position.y + this.direction.y)

            if (gameObject instanceof Pacman) return false;
            return gameObject;

        })()

        if (isBlocked) {
            console.log(isBlocked);

            this.renderOffset.x = 0;
            this.renderOffset.y = 0;
            this.direction = this.bufferedDirection
            this.timeUntilNextMove = 1;
            return;
        }

        if (
            this.bufferedDirection.x !== 0 && (this.direction.x * -1 === this.bufferedDirection.x) ||
            this.bufferedDirection.y !== 0 && (this.direction.y * -1 === this.bufferedDirection.y)
        ) {
            this.position.x += this.direction.x;
            this.position.y += this.direction.y;
            this.direction = this.bufferedDirection;
            this.timeUntilNextMove = 1- this.timeUntilNextMove;
        }

        if (this.timeUntilNextMove <= 0) {
            console.log("move")

            this.position.x += this.direction.x;
            this.position.y += this.direction.y;

            this.direction = this.bufferedDirection;

            this.timeUntilNextMove = 1;
        }

        this.timeUntilNextMove -= delta * 2;


        this.renderOffset.x = (this.direction.x) * (1 - this.timeUntilNextMove)
        this.renderOffset.y = (this.direction.y) * (1 - this.timeUntilNextMove)
    }
}