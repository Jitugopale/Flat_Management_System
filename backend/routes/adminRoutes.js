import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { approveFlatController, getPendingFlatsController, getSoldFlatsController, rejectFlatController } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/flats/pending',authMiddleware,roleMiddleware("ADMIN"),getPendingFlatsController);
adminRouter.put('/flats/:id/approve',authMiddleware,roleMiddleware("ADMIN"),approveFlatController);
adminRouter.put('/flats/:id/reject',authMiddleware,roleMiddleware("ADMIN"),rejectFlatController)
adminRouter.get('/flats/sold',authMiddleware,roleMiddleware("ADMIN"),getSoldFlatsController)

export default adminRouter;