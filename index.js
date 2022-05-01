const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 4000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Connect with MongoDB
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8bfbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  console.log("Bike Town DB Connected");
  // perform actions on the collection object
  client.close();
});

// ROOT / Blank API
app.get("/", (req, res) => {
  res.send("Running Bike Town Server");
});

// Root API Supporter
app.listen(port, () => {
  console.log("Listening to port");
});
