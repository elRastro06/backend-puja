const express = require("express");
const app = express();
const port = 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const connectionString = "mongodb+srv://pepe:pepe@cluster.d6ahydd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
      await client.connect();
      const db = await client.db("el-rastro");
      console.log("You successfully connected to MongoDB!");

      app.get("/", async (req, res) => {
        db.collection("bids").findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result.name);
            db.close();
        });
    });
    } catch(e) {
        console.log(e);
    }
  }
run().catch(console.dir);



app.get("/json", (req, res) => {
  res.json({
    pepe: "soy tontito",
    anotherKey: "antonio caca",
    moreData: {
      nestedKey: "nestedValue",
      arrayKey: [1, 2, 3],
    },
  });
});

app.get("/pepe", (req, res) => {
  res.send("pepe");
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
