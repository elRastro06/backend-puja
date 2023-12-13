import express from "express";
import v1 from "./v1.mjs";
import cors from "cors";
import axios from "axios";
import { ObjectId } from "mongodb";
import bids from "./conn.mjs";

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
    const user = response.data.user;

    if ((req.method == 'PUT' || req.method == 'DELETE') && req.params.id != undefined) {
        const bid = await bids.findOne({ _id: new ObjectId(req.params.id) });
        if (bid.userId != user._id) res.status(402).send("Unauthorized action");
    } else if (req.method == 'DELETE' && req.params.id == undefined) res.status(402).send("Unauthorized action");
    else if (req.method == 'POST' && req.body.userId != user._id) res.status(402).send("Unauthorized action");

    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
}

app.use("/v1", verifyToken, v1);