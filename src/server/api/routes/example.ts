import { Router } from "express";

const router = Router();

export default (app: Router) => {
    app.use("/example", router);

    router.get("/", async (req, res, next) => {
            return res.json("This is an example route!");
    });
};