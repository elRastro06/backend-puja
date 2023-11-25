import express from "express";
import v1 from "./v1.mjs";
import cors from "cors";

const app = express();
app.use(cors());
const port = 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

app.use("/v1", v1);