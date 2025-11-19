import express from 'express';
import path from "node:path";
import * as fs from "node:fs";
import {LevelData} from "../shared/types";

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

        this.app.listen(Server.PORT, () => {
            console.log(`Server runs on http://localhost:${Server.PORT}`);
        });
    }
}