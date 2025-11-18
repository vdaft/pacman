import {Vector2Like} from "./types";
import {GameObject} from "./gameobjects/GameObject";
import {Wall} from "./gameobjects/Wall";

export type LevelData = {
    layout: string[]
}

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

    static parseFromJson(json: LevelData, size: Vector2Like): Level {
        const ret = new Level();
        ret.maxSize = size;

        const layout = json.layout;


        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                switch (layout[y][x]) {
                    case "#":
                        ret.addObject(new Wall({x, y}));
                        break;
                    default:
                        break;
                }
            }
        }

        return ret;
    }
}