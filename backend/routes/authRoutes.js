import express from "express"
import { registerController } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register',registerController)

export default authRouter;