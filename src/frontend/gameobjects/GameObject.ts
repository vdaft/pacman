import {Vector2Like} from "../types";
import {Level} from "../Level";



export abstract class GameObject {
    private _texture: CanvasRenderingContext2D;
    public position: Vector2Like;
    public renderOffset: Vector2Like = {x: 0, y: 0};

    constructor(position: Vector2Like) {
        this._texture = this.createTexture()
        this.position = position
    }

    get texture() {return this._texture.canvas}

    protected abstract createTexture(): CanvasRenderingContext2D
    update(delta: number, level: Level): void {}
}