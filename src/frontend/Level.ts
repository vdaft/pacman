import {Vector2Like} from "./types";
import {GameObject} from "./gameobjects/GameObject";

export class Level {
    private _objects: GameObject[] = [];
    maxSize: Vector2Like = {x: 10, y: 10};

    constructor() {}

    get objects() {
        return this._objects;
    }

    addObject(obj: GameObject) {
        if (obj.position.x > this.maxSize.x || obj.position.y > this.maxSize.y) return;

        this.objects.push(obj);
    }
}