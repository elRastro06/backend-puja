import { ObjectId } from "mongodb";
import bids from "./conn.mjs";
import express from "express";

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

app.get("/", async (req, res) => {
    try {
        let filtro = {};
        let orden = {};
        const queries = req.query;

        if (queries.productId) {
            filtro = { ...filtro, productId: parseInt(queries.productId) };
        }
        if(queries.amount) {
            filtro = { ...filtro, amount: parseFloat(queries.amount) }
        }

        if(queries.orderBy && queries.order){
            orden = { ...orden, [queries.orderBy]: queries.order };
        }

        let results = await bids.find(filtro).sort(orden)
            .toArray();
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
        /*const highestBid = fetch(req.protocol + "://" + req.get("host") + "/highest?productId=" + bid.productId).then(response => {
            console.log(response);
        });*/
        const result = await bids.insertOne(bid);
        res.send(result).status(200);
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