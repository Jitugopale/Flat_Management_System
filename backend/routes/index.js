import express from "express"
import authRouter from "./authRoutes.js";
import flatRouter from "./flatRoutes.js";
import adminRouter from "./adminRoutes.js";
import enquiryRouter from "./enquiryRoutes.js";

const rootRouter = express.Router();

rootRouter.use('/auth',authRouter);
rootRouter.use('/flat',flatRouter);
rootRouter.use('/admin',adminRouter)
rootRouter.use('/enquiry',enquiryRouter)

export default rootRouter;