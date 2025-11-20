import {GameObject} from "./GameObject";
import {Game} from "../Game";
import {Level} from "../Level";
import {Vector2Like} from "../types";
import {Pacman} from "./Pacman";
import {Wall} from "./Wall";

export const NoAI = () => {return {x: 0, y: 0};};
export const StandardAI = (level: Level, pacman: Pacman) => {
    if (!this) return;
    if (!((this as any) instanceof Ghost)) return;

    const directions: Record<string, Vector2Like> = {
        "right": { x: 1,  y: 0  },
        "left":  { x: -1, y: 0  },
        "up":    { x: 0,  y: -1 },
        "down":  { x: 0,  y: 1  }
    }

    for (const dirKey of Object.keys(directions)) {
        const dir = directions[dirKey]

        const go = level.getGameObjectAt(pacman.position.x + dir.x, pacman.position.y + dir.y)
        if (!(go instanceof Wall)) {
            (this! as Pacman).direction = dir;
        }
    }
}


export class Ghost extends GameObject {
    direction: Vector2Like = {x: 0, y: 1};
    bufferedDirection: Vector2Like = {x: 0, y: 1};
    timeUntilNextMove: number = 10

    behavior?: (level: Level, pacman: Pacman) => Vector2Like;

    constructor(position: Vector2Like, behavior: (level: Level, pacman: Pacman) => Vector2Like = NoAI) {
        super(position);
        this.behavior = behavior.bind(this);
    }

    async createTexture(): Promise<ImageBitmap> {
        const canvas = document.createElement('canvas');

        canvas.width = Game.TILE_SIZE;
        canvas.height = Game.TILE_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');

        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return await createImageBitmap(canvas);
    }

    update(delta: number, level: Level) {
        const isBlocked = (() => {
            const gameObject = level.getGameObjectAt(this.position.x + this.direction.x, this.position.y + this.direction.y)

            if (gameObject instanceof Ghost) return false;
            return gameObject;

        })()

        if (isBlocked) {
            this.renderOffset.x = 0;
            this.renderOffset.y = 0;

            const pacman = level.objects.find(o => o instanceof Pacman)
            if (this.behavior && pacman) {
                this.direction = this.behavior(level, pacman);
            }

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

            if (!(() => {
                const gameObject = level.getGameObjectAt(this.position.x + this.bufferedDirection.x, this.position.y + this.bufferedDirection.y)

                if (gameObject instanceof Ghost) return false;
                return gameObject;
            })()) {
                this.direction = this.bufferedDirection;
            }

            this.timeUntilNextMove = 1;
        }

        this.timeUntilNextMove -= delta * 4;


        this.renderOffset.x = (this.direction.x) * (1 - this.timeUntilNextMove)
        this.renderOffset.y = (this.direction.y) * (1 - this.timeUntilNextMove)
    }
}