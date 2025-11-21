import {GameObject} from "./GameObject";
import {Game} from "../Game";
import {Level} from "../Level";
import {Pacman} from "./Pacman";

export class Star extends GameObject {
    async createTexture(): Promise<ImageBitmap> {
        const imgSrc = "assets/objects/star.png"

        const img = new Image();
        img.src = imgSrc;
        await img.decode();

        return await createImageBitmap(img, {
            resizeWidth: Game.TILE_SIZE,
            resizeHeight: Game.TILE_SIZE,
            resizeQuality: "high"
        });
    }

    update(delta: number, level: Level) {
        super.update(delta, level);

        const pacman = level.objects.find(p => p instanceof Pacman)

        if (pacman && pacman.position.x === this.position.x && pacman.position.y === this.position.y) {
            level.removeObject(this);
        }
    }
}