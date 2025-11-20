import {Vector2Like} from "../types";
import {Level} from "../Level";



export abstract class GameObject {
    protected _texture: ImageBitmap | null = null;
    public position: Vector2Like;
    public renderOffset: Vector2Like = {x: 0, y: 0};

    constructor(position: Vector2Like) {
        this.position = position
    }

    get texture() {return this._texture}

    abstract createTexture(): Promise<ImageBitmap>;

    // Async Initialisierung
    async initTexture(): Promise<void> {
        this._texture = await this.createTexture();
    }

    // Update/Refresh
    async updateTexture(): Promise<void> {
        this._texture = await this.createTexture();
    }

    update(delta: number, level: Level): void {}
}