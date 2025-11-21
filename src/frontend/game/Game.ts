import {Renderer} from "./Renderer";
import {Level} from "./Level";
import {Vector2Like} from "./types";
import {Pacman} from "./gameobjects/Pacman";
import {Ghost, StandardAI} from "./gameobjects/Ghost";
import {SwipeDetector} from "./swipe";
import {DEFAULT_URL} from "../../shared/config";
import {Star} from "./gameobjects/Star";

let lastTime = performance.now();
let delta = 0

export class Game {
    static TILE_SIZE = 50 / 2;
    static LEVEL_SIZE: Vector2Like = {x: 9 * 2, y: 16 * 2}

    fps: number = 60;
    private renderer: Renderer;
    private running: boolean = false;
    level!: Level;

    ghostsLeft;
    spawnInterval = 10000
    lastGhostSpawn = 0

    constructor(public ctx: CanvasRenderingContext2D, private userId: string, private availableGhosts: string[], private difficulty = 1) {
        this.renderer = new Renderer(ctx);
        this.ghostsLeft = this.difficulty;
    }

    async init() {
        const res = await fetch("api/levels/level")
        const data = await res.json()
        this.level = Level.parseFromJson(data, Game.LEVEL_SIZE)

        const pacman = new Pacman({x: 5, y: 5})
        await pacman.initTexture()
        this.level.addObject(pacman)

        // TODO: Add Ghosts, change Textures to available Ghosts, scale with Difficulty

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

        const detector = new SwipeDetector(this.renderer.canvas, {minDistance: 40, flingVelocity: 0.3})

        detector.onSwipe = (ev) => {
            // Beispiel-Mapping: einfache Aktionen
            if (ev.type === 'swipe' || ev.type === 'fling') {
                // Bewegung oder Dash in Richtung
                if (ev.direction === 'left') pacman.bufferedDirection = {x: -1, y: 0}
                if (ev.direction === 'right') pacman.bufferedDirection = {x: 1, y: 0}
                if (ev.direction === 'up') pacman.bufferedDirection = {x: 0, y: -1}
                if (ev.direction === 'down') pacman.bufferedDirection = {x: 0, y: 1}
            }
        };
    }

    loop() {
        if (!this.running) return;

        const pacman = this.level.objects.find(o => o instanceof Pacman)
        const ghosts_touching_pm = this.level.objects.filter(o => {
            return pacman && pacman.position && (o instanceof Ghost) && (o.position.x === pacman?.position.x && o.position.y === pacman?.position.y)
        })

        if (Date.now() > this.lastGhostSpawn + this.spawnInterval && this.ghostsLeft > 0) {
            const ghostType = this.availableGhosts.pop() ?? "doel";
            const ghost = new Ghost({x: 5, y: 3}, `/assets/ghosts/${ghostType}.png`, StandardAI)

            ghost.initTexture().then(() => this.level.addObject(ghost))

            this.ghostsLeft--;
            this.lastGhostSpawn = Date.now()

            console.log(`ghost spawned, ${this.ghostsLeft} left.`)
        }

        if (ghosts_touching_pm.length > 0) {
            this.stop()
            return window.location.href = `${DEFAULT_URL}/menu`
        }

        if (this.level.toRemove.length > 0) {
            this.level.objects = this.level.objects.filter(
                o => !this.level.toRemove.includes(o)
            );

            if (this.level.objects.filter(o => o instanceof Star).length === 0) {
                this.stop()
                fetch(`api/users/${this.userId}/reward?points=${this.difficulty * 20}`)
                    .then(() => {
                        alert("You won!")
                        window.location.href = `${DEFAULT_URL}/menu`
                    })
            }
        }

        const currentTime = performance.now();
        delta += (currentTime - lastTime) / 1000;
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