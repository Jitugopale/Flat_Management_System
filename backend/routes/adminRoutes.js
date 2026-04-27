import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { getPendingFlatsController } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/flats/pending',authMiddleware,roleMiddleware("ADMIN"),getPendingFlatsController)

export default adminRouter;