import express from "express";
import v1 from "./v1.mjs";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
const port = 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

const clients = process.env.CLIENTS != undefined ? process.env.CLIENTS : "localhost";

const verifyToken = async (req, res, next) => {
  try {
    const response = await axios.get(`http://${clients}:5000/checkToken/${req.headers.authorization}`);
    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
}

app.use("/v1", verifyToken, v1);