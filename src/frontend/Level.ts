import {Vector2Like} from "./types";
import {GameObject} from "./gameobjects/GameObject";
import {Wall} from "./gameobjects/Wall";
import {LevelData} from "../shared/types";



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

        const {layout, key} = json;


        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                const char = layout[y][x];

                if (key[char] !== undefined) {
                    switch (key[char].type) {
                        case "wall":
                            const obj = new Wall({x, y}, key[char].args.color)
                            obj.updateTexture()

                            ret.addObject(obj)
                            console.log("wall created", key[char].args.color);
                    }
                }
            }
        }

        return ret;
    }
}