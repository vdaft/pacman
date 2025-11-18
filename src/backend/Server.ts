import express from 'express';
import path from "node:path";
import * as fs from "node:fs";

export class Server {
    static PORT = 3000;
    static LEVELS_DIR = "./config/levels"

    app = express()


    constructor() {
        this.app.get("/api/levels/:name", (req: express.Request, res: express.Response) => {
            const name = req.params.name;
            const levelPath = path.join(Server.LEVELS_DIR, `${name}.txt`);

            if (!fs.existsSync(levelPath)) {return res.json({error: "Level not found!"})}

            const levelContent = fs.readFileSync(levelPath, "utf8");

            const layout = levelContent.split("\n").map((line) => line.trim());

            res.json({layout})
        })

        this.app.listen(Server.PORT, () => {
            console.log(`Server runs on http://localhost:${Server.PORT}`);
        });
    }
}