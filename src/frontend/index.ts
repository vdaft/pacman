import { Game } from "./Game";

async function main() {
    const canvas = document.getElementById("pacman") as HTMLCanvasElement;
    if (!canvas) throw new Error("Can't create pacman");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No Context provided");

    canvas.width = 900;
    canvas.height = 1600;

    const game = new Game(ctx);
    await game.init();
    game.start();
}

main();