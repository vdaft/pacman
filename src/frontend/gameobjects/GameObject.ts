import {Vector2Like} from "../types";



export abstract class GameObject {
    private _texture: CanvasRenderingContext2D;
    public position: Vector2Like;

    constructor(position: Vector2Like) {
        this._texture = this.createTexture()
        this.position = position
    }

    get texture() {return this._texture.canvas}

    protected abstract createTexture(): CanvasRenderingContext2D
    protected update(delta: number): void {}
}