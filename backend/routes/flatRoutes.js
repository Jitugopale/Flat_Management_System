import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
// multer → used to handle file uploads (images in your case)
// path → helps create proper folder paths (works on all OS)
// fs → file system module (used to create folders)
import { file } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createFlatController, getApprovedFlatsController, getUserFlatsController } from "../controllers/flatController.js";


const flatRouter = express.Router();

// Creates a storage engine that saves files to disk (not memory). 
// Hey, when someone uploads a file, save it in my computer (server folder), not just temporarily in RAM (memory).”
// diskStorage → saves file in a folder (like uploads/)
const storage = multer.diskStorage({
    //destination - Function that decides where to save the uploaded file. Runs for every upload.
    destination:(req,file,cb)=>{
        // It receives:
        // req → request object
        // file → current file
        // cb → callback (used to return result)
        const userId = req.user.id;

        const dir = path.join("uploads",String(userId),"images");
        // Builds the folder path → uploads/42/images (42 = user's id).
        fs.mkdirSync(dir,{recursive:true});
        //Creates the folder if it doesn't exist. recursive:true creates all parent folders too, no error if already exists.
        cb(null,dir);
        //Tells multer — "no error, save the file in this dir".
        // cb → callback function (used to return result to multer)
        // null → means no error
        // dir → the folder path (like uploads/123/images)
            }
    ,
    //Function that decides what to name the saved file.
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname || "");
        //Gets the file extension from original name → e.g. .jpg, .png.
        const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
        //Math.round() - Gives random number between 0 and 1, 1e9 = 1000000000
        //0.45678 * 1000000000 = 456780000
        //Creates a unique filename using timestamp + random number → e.g. 1714200000000-583920174.jpg. Prevents name collisions
        cb(null,name)
        //Tells multer — "no error, save with this name"
    }
})

const upload = multer({storage,limits:{fileSize:5*1024*1024}});
// Creates the final upload middleware using the storage config above. Max file size = 5MB (5 * 1024 * 1024 bytes).Rejects anything larger.
//End result: Each user's uploads go to their own folder → uploads/{userId}/images/1714200000-583920174.jpg
flatRouter.post('/createFlat',authMiddleware,upload.array("images",5),createFlatController)
//upload.array("images", 5) is a multer middleware that:
                                                                                                                     
  //┌──────────┬─────────────────────────────────────────────┐                                                             
  //│   Part   │                   Meaning                   │
  //├──────────┼─────────────────────────────────────────────┤                                                             
  //│ upload   │ The multer instance we created              │                                                           
  //├──────────┼─────────────────────────────────────────────┤
  //│ .array   │ Accepts multiple files (not just one)       │
  //├──────────┼─────────────────────────────────────────────┤
  //│ "images" │ The form field name expected in the request │
  //├──────────┼─────────────────────────────────────────────┤
  //│ 5        │ Max 5 files allowed per request             │
  //└──────────┴─────────────────────────────────────────────┘

  flatRouter.get('/getApprove',getApprovedFlatsController);
  flatRouter.get('/getFlats',authMiddleware,getUserFlatsController);


export default flatRouter;