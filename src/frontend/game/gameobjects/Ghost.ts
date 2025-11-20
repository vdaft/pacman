import {GameObject} from "./GameObject";
import {Game} from "../Game";
import {Level} from "../Level";
import {Vector2Like} from "../types";
import {Pacman} from "./Pacman";
import {Wall} from "./Wall";

export function NoAI(this: Ghost, level: Level, pacman: Pacman) {return {x: 0, y: 0}}
export function StandardAI(this: Ghost, level: Level, pacman: Pacman) {
    const directions: Record<string, Vector2Like> = {
        right: { x: 1 , y: 0  },
        left:  { x: -1, y: 0  },
        up:    { x: 0 , y: -1 },
        down:  { x: 0 , y: 1  },
    }

    const reverse = {x: -this.direction.x, y: -this.direction.y}

    const movement = {
        direction: reverse,
        dist: 1000
    }

    for (const key of Object.keys(directions)) {
        const dir = directions[key]
        if (dir.x === reverse.x && dir.y === reverse.y) continue;

        const rx = Math.abs(this.position.x + directions[key].x)
        const ry = Math.abs(this.position.y + directions[key].y)

        if (level.getGameObjectAt(rx, ry) instanceof Wall) continue;

        const dx = rx - pacman.position.x;
        const dy = ry - pacman.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < movement.dist) {
            movement.dist = dist;
            movement.direction = dir;
        }
    }

    return movement.direction;
}



export class Ghost extends GameObject {
    direction: Vector2Like = {x: 0, y: 1};
    timeUntilNextMove: number = 10

    behavior?: (level: Level, pacman: Pacman) => Vector2Like | undefined;

    constructor(
        position: Vector2Like,
        public imgSrc: string,
        behavior: (level: Level, pacman: Pacman) => Vector2Like | undefined = NoAI
    ) {
        super(position);
        this.behavior = behavior.bind(this);
    }

    async createTexture(): Promise<ImageBitmap> {
        if (!this.imgSrc) throw new Error("Ghost has no image source");

        const img = new Image();
        img.src = this.imgSrc;
        await img.decode(); // Bild laden

        // Zielgröße = Game.TILE_SIZE
        return await createImageBitmap(img, {
            resizeWidth: Game.TILE_SIZE,
            resizeHeight: Game.TILE_SIZE,
            resizeQuality: "high" // optional: "pixelated" für retro-Look
        });
    }


    update(delta: number, level: Level) {
        const isBlocked = (() => {
            const gameObject = level.getGameObjectAt(this.position.x + this.direction.x, this.position.y + this.direction.y)

            return gameObject instanceof Wall;
        })()

        if (isBlocked) {
            this.renderOffset.x = 0;
            this.renderOffset.y = 0;

            this.timeUntilNextMove = 1;
            return;
        }

        if (this.timeUntilNextMove <= 0) {
            console.log("move")

            this.position.x += this.direction.x;
            this.position.y += this.direction.y;

            const pacman = level.objects.find(o => o instanceof Pacman)
            if (this.behavior && pacman) {
                this.direction = this.behavior(level, pacman) ?? {x: 0, y: 0};
            }

            this.timeUntilNextMove = 1;
        }

        this.timeUntilNextMove -= delta * 4;


        this.renderOffset.x = (this.direction.x) * (1 - this.timeUntilNextMove)
        this.renderOffset.y = (this.direction.y) * (1 - this.timeUntilNextMove)
    }
}