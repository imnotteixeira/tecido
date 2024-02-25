import { Router } from "express";
import example from "./routes/example"

const router = Router();

const ping = (app: Router) => {
    app.use("/ping", router);

    /**
     * Health Check
     */
    router.get("/", async (req, res, next) => {

        res.json({ online: true })
    });
};

export default () => {
    const app = Router();
    ping(app)
    example(app);

    return app;
};