import {Vector2Like} from "../types";
import {Level} from "../Level";



export abstract class GameObject {
    protected _texture: CanvasRenderingContext2D;
    public position: Vector2Like;
    public renderOffset: Vector2Like = {x: 0, y: 0};

    constructor(position: Vector2Like) {
        this._texture = this.createTexture()
        this.position = position
    }

    get texture() {return this._texture.canvas}

    abstract createTexture(): CanvasRenderingContext2D
    public updateTexture(): void {
        this._texture = this.createTexture();
    }

    update(delta: number, level: Level): void {}
}