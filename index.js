const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Make app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4ueyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("productDb").collection("products");

        // Post Api
        app.post('/product', async (req, res) => {
            const product = req.body;
            await productCollection.insertOne(product);
            res.send(product);
        });

        // Get Api
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get Api for single Product
        app.get('/product/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        // Delete Api
        app.delete('/product/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        // Put Api 
        app.put('/product/:id', async (req, res) => {
            const { id } = req.params;
            const updatedProduct = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedProduct
            };
            await productCollection.updateOne(query, updatedDoc, options);
            res.send(updatedProduct);
        });
    }
    finally {

    }
}
run().catch(console.dir);

//Check Get Req
app.get('/', (req, res) => {
    res.send('Product Server Running');
});

// Listen
app.listen(port, () => {
    console.log('Running CRUD Server');
});