import express from "express"
import authRouter from "./authRoutes.js";
import flatRouter from "./flatRoutes.js";

const rootRouter = express.Router();

rootRouter.use('/auth',authRouter);
rootRouter.use('/flat',flatRouter);

export default rootRouter;