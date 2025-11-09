import {Game} from "./Game";

const canvas = document.getElementById("pacman");
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Can't create pacman");
}

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No Context provided");


const RENDER_WIDTH = 900;
const RENDER_HEIGHT = 1600;
canvas.width = RENDER_WIDTH;
canvas.height = RENDER_HEIGHT;


const game = new Game(ctx);
game.start();