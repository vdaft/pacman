import {Vector2Like} from "./types";
import {GameObject} from "./gameobjects/GameObject";

export class Level {
    private _objects: GameObject[] = [];
    maxSize: Vector2Like = {x: 10, y: 10};

    constructor() {}

    get objects() {
        return this._objects;
    }

    getGameObjectAt(x: number, y: number): GameObject | undefined {
        return this.objects.find(o => o.position.x === x && o.position.y === y);
    }

    addObject(obj: GameObject) {
        if (obj.position.x > this.maxSize.x || obj.position.y > this.maxSize.y) return;

        this.objects.push(obj);
    }
}