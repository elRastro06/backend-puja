import { MongoClient } from "mongodb";
const connectionString = "mongodb+srv://pepe:pepe@cluster.d6ahydd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);
let conn;
try {
    conn = await client.connect();
} catch (e) {
    console.error(e);
}
let db = conn.db("sample_training");
let bids = db.collection("bids");
export default bids;