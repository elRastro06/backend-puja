import bids from "./conn.mjs";
import express from "express";

const app = express();
const port = 5000;

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

app.get("/", async (req, res) => {
    let collection = await bids;
    let results = await collection.find({})
        .toArray();
    res.send(results).status(200);
});

app.post("/", async (req, res) => {
    const bid = { productId: 1, amount: 50 };
    const result = await bids.insertOne(bid);
    console.log(result);
    res.send(result);
});

app.get("/:id", async (req, res) => {

});

app.delete("/:id", async (req, res) => {

});

app.put("/:id", async (req, res) => {

});