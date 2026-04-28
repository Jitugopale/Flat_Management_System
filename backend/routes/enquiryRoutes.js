import express from "express"
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getAllEnquiriesController, getSellerEnquiriesController, getUserEnquiriesController, sendEnquiryController } from "../controllers/enquiryController.js";

const enquiryRouter = express.Router();

//User
enquiryRouter.post('/sendEnquiry',authMiddleware,roleMiddleware("USER"),sendEnquiryController)
enquiryRouter.get('/getEnquiry',authMiddleware,roleMiddleware("USER"),getUserEnquiriesController)
enquiryRouter.get("/flats/received", authMiddleware,roleMiddleware("USER"), getSellerEnquiriesController);

//Admin
enquiryRouter.get('/getAllEnquiry',authMiddleware,roleMiddleware("ADMIN"),getAllEnquiriesController)

export default enquiryRouter;