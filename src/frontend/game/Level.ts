import {Vector2Like} from "./types";
import {GameObject} from "./gameobjects/GameObject";
import {Wall} from "./gameobjects/Wall";
import {LevelData} from "../../shared/types";
import {Star} from "./gameobjects/Star";



export class Level {
    private _objects: GameObject[] = [];
    public toRemove: GameObject[] = [];
    maxSize: Vector2Like = {x: 10, y: 10};

    constructor() {}

    get objects() {
        return this._objects;
    }

    set objects(objects: GameObject[]) {
        this._objects = objects;
    }

    getGameObjectAt(x: number, y: number): GameObject | undefined {
        return this.objects.find(o => o.position.x === x && o.position.y === y);
    }

    addObject(obj: GameObject) {
        this.objects.push(obj);
    }

    removeObject(obj: GameObject) {
        this.toRemove.push(obj)
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
                            const wall = new Wall({x, y}, key[char].args.color)
                            wall.initTexture()

                            ret.addObject(wall)
                            console.log("wall created", key[char].args.color);
                            break;
                        case "star":
                            const star = new Star({x, y});
                            star.initTexture()

                            ret.addObject(star)
                            console.log("star created");
                            break;
                    }
                }
            }
        }

        return ret;
    }
}