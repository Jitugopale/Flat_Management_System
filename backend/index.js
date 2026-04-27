import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rootRouter from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
// Imports a helper to convert a file URL into a normal file path.
  // ┌─────────────────┬────────────────────────────────────────────────────┐
  // │      Part       │                      Meaning                       │
  // ├─────────────────┼────────────────────────────────────────────────────┤
  // │ import.meta.url │ Current file's URL → file:///C:/Users/.../index.js │
  // ├─────────────────┼────────────────────────────────────────────────────┤
  // │ fileURLToPath() │ Converts it to → C:\Users\...\index.js             │
  // └─────────────────┴───────────────────────────────────────────────────
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
//Gets the folder path from the file path.
  // __filename = "C:\Users\Admin\Desktop\...\backend\index.js"
  // __dirname  = "C:\Users\Admin\Desktop\...\backend"

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  }),
);

app.use("/uploads",express.static(path.join(__dirname,"uploads")));
  // ┌─────────────────────────────────┬──────────────────────────────────────────┐
  // │              Part               │                 Meaning                  │
  // ├─────────────────────────────────┼──────────────────────────────────────────┤
  // │ "/uploads"                      │ URL path the browser requests            │
  // ├─────────────────────────────────┼──────────────────────────────────────────┤
  // │ express.static()                │ Serves files from a folder directly      │
  // ├─────────────────────────────────┼──────────────────────────────────────────┤
  // │ path.join(__dirname, "uploads") │ Points to backend/uploads folder on disk │
  // └─────────────────────────────────┴──────────────────────────────────────────┘

  // Flow:
  // Browser requests → /uploads/1/images/photo.jpg
  // Express looks in → C:\...\backend\uploads\1\images\photo.jpg
  // Found? → sends the file ✓

  // ---
  // Simple answer: You told Express — "whenever someone requests /uploads/..., find and send that file from the uploads 
  // folder on disk."

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server runing on PORT no ${PORT}`);
});
