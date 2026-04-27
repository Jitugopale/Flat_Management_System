import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rootRouter from "./routes/index.js";
dotenv.config();

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

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server runing on PORT no ${PORT}`);
});
