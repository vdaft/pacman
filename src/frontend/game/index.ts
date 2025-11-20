import { Game } from "./Game";
import {DEFAULT_URL} from "../../shared/config";

async function main() {
    console.log(document.cookie)

    if (!document.cookie.trim().split("=")[1]) {
        window.location.href = `${DEFAULT_URL}/login`;
    }

    const difficulty = new URL(window.location.href).searchParams.get("difficulty");
    if (!difficulty) window.location.href = `${DEFAULT_URL}/menu`;

    // TODO: Difficulty, lookup Ghosts

    const canvas = document.getElementById("pacman") as HTMLCanvasElement;
    if (!canvas) throw new Error("Can't create pacman");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No Context provided");

    canvas.width = 900 / 2;
    canvas.height = 1600 / 2;

    const game = new Game(ctx);
    await game.init();
    game.start();
}

main();