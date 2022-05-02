const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 7000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


// Connect with MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9vvtv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// Async Function
async function run() {
  try {
    await client.connect();
    const bikeCollection = client.db("bikeUser").collection("bike");

    // API for Bike Collection
    app.get("/bike", async (req, res) => {
      const query = {};
      const cursor = bikeCollection.find(query);
      const bikes = await cursor.toArray();
      res.send(bikes);
    });
  } 
  finally {

  }
}

run().catch(console.dir);


// ROOT / Blank API
app.get("/", (req, res) => {
  res.send("Running Bike Town Server");
});

// Root API Supporter
app.listen(port, () => {
  console.log("Listening to port", port);
});
