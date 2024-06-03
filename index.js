const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;

// middleware
app.use(cors({

    origin: [
        'http://localhost:5173',
        'https://antopolis-task.web.app',

    ],
    credentials: true,

}));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.cbqlcas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categorisCollection = client
      .db("Antropolis")
      .collection("categories");
    const animalCollection = client.db("Antropolis").collection("animallist");

    app.get("/categories", async (req, res) => {
      const result = await categorisCollection.find().toArray();
      res.send(result);
    });
    app.get("/allcategories", async (req, res) => {
      const result = await animalCollection.find().toArray();
      res.send(result);
    });
    app.post("/categories", async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await categorisCollection.insertOne(category.categoryData);
      res.send(result);
    });
    app.post("/allcategories", async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await animalCollection.insertOne(category.data);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
