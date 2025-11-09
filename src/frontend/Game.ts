import {Renderer} from "./Renderer";
import {Level} from "./Level";
import {Vector2Like} from "./types";
import {Pacman} from "./gameobjects/Pacman";
import {Wall} from "./gameobjects/Wall";

let lastTime = performance.now();
let delta = 0

export class Game {
    static TILE_SIZE = 100;
    static LEVEL_SIZE: Vector2Like = {x: 9, y: 16}

    fps: number = 60;
    private renderer: Renderer;
    private running: boolean = false;
    level = new Level();

    constructor(public ctx: CanvasRenderingContext2D) {
        this.renderer = new Renderer(ctx);
        this.level.maxSize = Game.LEVEL_SIZE;

        const pacman = new Pacman({x: 5, y: 5})

        this.level.addObject(pacman)
        this.level.addObject(new Wall({x: 5, y: 8}))
        this.level.addObject(new Wall({x: 5, y: 2}))


        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                pacman.bufferedDirection = {x: 0, y: -1}
            } else if (e.key === "ArrowDown") {
                pacman.bufferedDirection = {x: 0, y: 1}
            } else if (e.key === "ArrowRight") {
                pacman.bufferedDirection = {x: 1, y: 0}
            } else if (e.key === "ArrowLeft") {
                pacman.bufferedDirection = {x: -1, y: 0}
            }
        })
    }

    loop() {
        if (!this.running) return;

        const currentTime = performance.now();
        delta += (currentTime - lastTime)/1000;
        lastTime = currentTime

        const seconds_for_frame = 1 / this.fps;

        while (delta >= seconds_for_frame) {
            delta -= seconds_for_frame

            this.update(seconds_for_frame);
        }
        this.render()

        requestAnimationFrame(this.loop.bind(this));
    }

    update(delta: number) {
        for (const gameObject of this.level.objects) {
            gameObject.update(delta, this.level);
        }
    }
    render() {
        this.renderer.render(this.level)
    }


    start(): void {
        if (!this.running) {
            this.running = true;

            requestAnimationFrame(this.loop.bind(this));
        }
    }
    stop(): void {
        if (this.running) {
            this.running = false;
        }
    }
}