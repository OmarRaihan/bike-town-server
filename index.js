const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const ObjectId = require('mongodb').ObjectId;
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

    // API || All Bike by ID
    app.get("/bike/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bike = await bikeCollection.findOne(query);
      res.send(bike);
    });

    // POST API ||
    app.post("/bike", async (req, res) => {
      const newItem = req.body;
      const result = await bikeCollection.insertOne(newItem);
      res.send(result);
    });

    // DELETE API || Inventory
    app.delete("/bike/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.deleteOne(query);
      res.send(result);
    });

    // Update Quantity || API
    app.get("/bike/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      // const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { updateQuantity: data.updateQuantity };

      const result = await bikeCollection.updateOne(filter, updateDoc, options);
      res.send(result);

    });
  } 
  finally {

  }
}

run().catch(console.dir);


// -----------------------------------------------
// Function for Kit
async function runKit() {
  try {
    await client.connect();
    const kitCollection = client.db("bikeUser").collection("kit");

    // API for Kit Collection
    app.get("/kit", async (req, res) => {
      const query = {};
      const cursor = kitCollection.find(query);
      const kits = await cursor.toArray();
      res.send(kits);
    });
  } finally {
  }
}
runKit().catch(console.dir);
// ---------------------------------------------------

// -----------------------------------------------
// Function for Parts
async function runParts() {
  try {
    await client.connect();
    const partsCollection = client.db("bikeUser").collection("parts");

    // API for Spares & Parts Collection
    app.get("/parts", async (req, res) => {
      const query = {};
      const cursor = partsCollection.find(query);
      const parts = await cursor.toArray();
      res.send(parts);
    });
  } finally {
  }
}
runParts().catch(console.dir);
// ---------------------------------------------------

// ROOT / Blank API
app.get("/", (req, res) => {
  res.send("Running Bike Town Server");
});

// Root API Supporter
app.listen(port, () => {
  console.log("Listening to port", port);
});
