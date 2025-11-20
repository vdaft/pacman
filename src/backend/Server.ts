import express from 'express';
import path from "node:path";
import * as fs from "node:fs";
import {LevelData} from "../shared/types";
import dotenv from "dotenv";
import {DEFAULT_URL} from "../shared/url";

dotenv.config();

export class Server {
    static PORT = 3000;
    static LEVELS_DIR = "./config/levels"

    app = express()


    constructor() {
        this.app.get("/api/levels/:name", (req: express.Request, res: express.Response) => {
            const name = req.params.name;
            const levelPath = path.join(Server.LEVELS_DIR, `${name}.json`);

            if (!fs.existsSync(levelPath)) {return res.json({error: "Level not found!"})}

            const levelContent = JSON.parse(fs.readFileSync(levelPath, "utf8")) satisfies LevelData;

            const {layout, key} = levelContent;

            res.json({layout, key})
        })

        this.app.get("/api/access", async (req: express.Request, res: express.Response) => {
            console.log("Access requested!");

            // Schritt 2
            const id = crypto.randomUUID()
            const url = `https://pe9012.schuelerprojekte.online//api/auth/createRedirectUri?state=${id}&redirect_uri=${DEFAULT_URL}${process.env.REDIRECT_PATH}`;

            console.log(url)

            await fetch(url);

            res.redirect(`https://pe9012.schuelerprojekte.online/oauth?state=${id}`)
        })

        this.app.get("/api/login", async (req: express.Request, res: express.Response) => {
            const state = req.query.userId as string
            const userId = req.query.userId as string

            const url = `https://pe9012.schuelerprojekte.online//api/public/user/name/${userId}`

            const data = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.SJ_API_KEY}`
                }
            })

            const userName = (await data.json()).value
            if (!userName) {
                res.json({error: "Username is required!"})
            }

            console.log(`${userName} logged in!`)

            res.cookie("userId", req.query.userId as string);
            res.redirect(`${DEFAULT_URL}/`)
        })

        this.app.listen(Server.PORT, () => {
            console.log(`Server runs on ${DEFAULT_URL}`);
        });
    }
}