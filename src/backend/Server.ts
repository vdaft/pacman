import express from 'express';
import path from "node:path";
import * as fs from "node:fs";
import {LevelData} from "../shared/types";
import dotenv from "dotenv";
import {DEFAULT_URL, USABLE_GHOSTS} from "../shared/config";

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
            console.log(userName)

            console.log(`${userName} (${userId}) logged in!`)

            res.cookie("userId", req.query.userId as string);
            res.redirect(`${DEFAULT_URL}/`)
        })


        {
            const router = express.Router();
            router.get("/:id/teachers", async (req: express.Request, res: express.Response) => {
                const requestedUserId = req.params.id;
                const apiKey = process.env.HTLGO_API_KEY;

                const url = `https://pe9013.schuelerprojekte.online/api/v1/inventory?requestedUserId=${requestedUserId}`;

                const data = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                })

                if (!data.ok) return res.json({error: "Invalid Request"})

                const parsedData = ((await data.json()).items! as any[]).map((o) => (o.slug as string)).filter(slug => slug in USABLE_GHOSTS);

                console.log(parsedData);

                res.json(parsedData);
            })

            router.get("/:id/name", async (req: express.Request, res: express.Response) => {
                const url = `https://pe9012.schuelerprojekte.online//api/public/user/name/${req.params.id}`

                const data = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${process.env.SJ_API_KEY}`
                    }
                })

                const userName = (await data.json()).value
                if (!userName) {
                    return res.json({error: "Username is required!"})
                }

                res.json({value: userName})
            })

            router.get("/:id/reward", async (req: express.Request, res: express.Response) => {
                const id = req.params.id;
                const points = (req.query.points as string)

                if (!id || !points) {
                    return res.json({error: "Invalid Request"})
                }

                if (Number.parseInt(points) > 300) return res.json({error: "Too many points!"})

                const x = await fetch("https://pe9012.schuelerprojekte.online/api/public/user/deposit", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.SJ_API_KEY}`
                    },
                    body: JSON.stringify({
                        userId: id,
                        points: `${points}`
                    })
                });

                const data = await x.text();
                console.log(`Added ${points} points to ${id}`);

                res.send(data)
            })

            this.app.use("/api/users", router)
        }

        this.app.listen(Server.PORT, () => {
            console.log(`Server runs on ${DEFAULT_URL}`);
        });
    }
}