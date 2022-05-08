const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 7000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Connect with MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9vvtv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Function for JWT
// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden Access" });
//     }
//     console.log("decoded", decoded);
//     req.decoded = decoded;
//   });
//   // console.log("Inside VerifyJWT", authHeader);
//   next();
// }

// Async Function
async function run() {
  try {
    await client.connect();
    const bikeCollection = client.db("bikeUser").collection("bike");
    const newItemCollection = client.db("bikeUser").collection("newItem");

    // API for Bike Collection
    app.get("/bike", async (req, res) => {
      const query = {};
      const cursor = bikeCollection.find(query);
      const bikes = await cursor.toArray();
      res.send(bikes);
    });

    // API || Manage by ID
    app.get("/bike/:id", async (req, res) => {
      const id = req.params.id.trim();
      const query = { _id: ObjectId(id) };
      const bike = await bikeCollection.findOne(query);
      res.send(bike);
    });

    // // POST API || Add New Items
    // app.post("/bike", verifyJWT, async (req, res) => {
    //   const decodedEmail = req.decoded.email;
    //   const email = req.query.email;
    //   if (email === decodedEmail) {
    //     const query = { email: email };
    //     const newItem = req.body;
    //     const result = await bikeCollection.insertOne(newItem, query);
    //     res.send(result);
    //   }
    //   else{
    //     res.status(403).send({ message: "Forbidden Access" });
    //   }
    // });


    // POST API || Add New Items || newItem Collection
    app.post("/newItem", async (req, res) => {
      const newItem = req.body;
      const result = await newItemCollection.insertOne(newItem);
      res.send(result);
    });

    // GET API || Add New Items || myItem
    app.get("/newItem", async (req, res) => {
      const email = req?.body?.email;
      const query = { email: email };
      const cursor = bikeCollection.find(query);
      const newItems = await cursor.toArray();
      res.json(newItems);
    });

    // POST API || Add New Bikes || bike Collection
    app.post("/bike", async (req, res) => {
      const newBike = req.body;
      const result = await bikeCollection.insertOne(newBike);
      res.send(result);
    });


    // Update Quantity || API
    app.put("/bike/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: product.quantity,
        },
      };
      const result = await bikeCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    // DELETE API || Inventory
    app.delete("/bike/:id", async (req, res) => {
      const id = req.params.id.trim();
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.deleteOne(query);
      res.send(result);
    });
    // DELETE API || Inventory
    app.delete("/newItem/:id", async (req, res) => {
      const id = req.params.id.trim();
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.deleteOne(query);
      res.send(result);
    });

    // // AUTH || JWT Token
    // app.post("/login", async (req, res) => {
    //   const user = req.body;
    //   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1d",
    //   });
    //   res.send(accessToken);
    // });
  } finally {
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
