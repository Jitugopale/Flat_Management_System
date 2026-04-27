import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

app.listen(PORT, () => {
  console.log(`Server runing on PORT no ${PORT}`);
});
