import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Express Backend API" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
