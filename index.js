const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 7000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hr9du.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("touristVai");
        console.log('connect to db')
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection('orders');
        // create a document to insert
        // read all services 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        });
        // read a service by id 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);

            res.send(service);
        });

        // post => 

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result);

            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running backend')
});

app.listen(port, () => {
    console.log('listening to port', port)
});