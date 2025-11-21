import { Game } from "./Game";
import {DEFAULT_URL} from "../../shared/config";


function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function main() {
    console.log(document.cookie)

    alert(`${DEFAULT_URL}/login`)


    if (!document.cookie.trim().split("=")[1]) {
        window.location.href = `${DEFAULT_URL}/login`;
    }

    const userId = document.cookie
        .split("; ")
        .find(row => row.startsWith("userId" + "="))
        ?.split("=")[1];

    if (!userId) {
        return window.location.href = `${DEFAULT_URL}/login`;
    }

    const difficulty = new URL(window.location.href).searchParams.get("difficulty");
    if (!difficulty) return window.location.href = `${DEFAULT_URL}/menu`;

    const availableGhosts = (await (await fetch(`api/users/${userId}/teachers`)).json())
    console.log(availableGhosts)

    const canvas = document.getElementById("pacman") as HTMLCanvasElement;
    if (!canvas) throw new Error("Can't create pacman");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No Context provided");

    canvas.width = 900 / 2;
    canvas.height = 1600 / 2;

    const game = new Game(ctx, userId, shuffle(availableGhosts), Number.parseInt(difficulty));
    await game.init();
    game.start();
}

main();