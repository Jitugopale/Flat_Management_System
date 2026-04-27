import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { approveFlatController, getPendingFlatsController } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/flats/pending',authMiddleware,roleMiddleware("ADMIN"),getPendingFlatsController);
adminRouter.put('/flats/:id/approve',authMiddleware,roleMiddleware("ADMIN"),approveFlatController);

export default adminRouter;