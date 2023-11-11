import { ObjectId } from "mongodb";
import bids from "./conn.mjs";
import express from "express";
import axios from "axios";

const app = express.Router();

app.get("/", async (req, res) => {
    try {
        let filtro = {};
        let orden = {};
        let offset = 0;
        let limit = 0;
        const queries = req.query;

        if (queries.productId) {
            filtro = { ...filtro, productId: queries.productId) };
        }
        if(queries.amount) {
            filtro = { ...filtro, amount: parseFloat(queries.amount) }
        }

        if(queries.orderBy && queries.order) {
            if (queries.order == "asc") {
                orden = { ...orden, [queries.orderBy]: 1 };
            } else if (queries.order == "desc") {
                orden = { ...orden, [queries.orderBy]: -1 };
            }
        }

        if(queries.offset) {
            offset = parseInt(queries.offset);
        }
        if(queries.limit) {
            limit = parseInt(queries.limit);
        }

        let results = await bids.find(filtro).sort(orden).skip(offset).limit(limit).toArray();
        res.send(results).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.get("/highest", async (req, res) => {
    try {
        const productId = req.query.productId;
        const productBids = await bids.find({ productId: parseInt(productId) }).toArray();
        let maxAmount = 0;
        productBids.forEach(p => {
            if(maxAmount < p.amount) maxAmount = p.amount;
        });
        res.send({ maxAmount: maxAmount }).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.post("/", async (req, res) => {
    try {
        const bid = req.body;

        let highestBid = 0;
        const response = await axios.get(req.protocol + "://" + req.get("host") + "/v1/highest?productId=" + bid.productId);
        highestBid = response.data.maxAmount;

        let result, status;
        if(req.body.amount > highestBid) {
            result = await bids.insertOne({ ...bid, date: new Date() });
            status = 200;
        }else {
            result = { information: "Bid not inserted. Higher bid already exists" };
            status = 400;
        }

        res.send(result).status(status);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.get("/:id", async (req, res) => {
    try {
        const result = await bids.findOne({ _id: new ObjectId(req.params.id) });
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.delete("/:id", async (req, res) => {
    try {
        const result = await bids.deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.delete("/", async (req, res) => {
    try {
        let result = await bids.deleteMany(req.body);
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.put("/:id", async (req, res) => {
    try {
        const result = await bids.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        res.send(result).status(200);
    } catch(e) {
        res.send(e).status(500);
    }
});

export default app;