const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f0ilt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        // console.log("connect to database");
        const database = client.db("sunShineTours");
        const travelsCollection = database.collection("travels");
        const ordersCollection = database.collection("orders");

        // load services get api
        app.get('/services', async (req, res) => {
            const cursor = travelsCollection.find({});;
            const result = await cursor.toArray();
            res.json(result);
        })

        // lode single service get api
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelsCollection.findOne(query);
            res.json(result);
        });

        // load myOrder data according to user ID get api
        app.get("/myOrder/:uid", async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = await ordersCollection.find(query).toArray();
            res.json(result);
        });

        // add data to order collection 
        app.post("/service/add", async (req, res) => {
            const service = req.body;
            const result = await ordersCollection.insertOne(service);
            res.json(result);
        });

        // delete data from myOrder delete api
        app.delete('/remove/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

        // checkOut all data api 
        app.delete("/checkOut/:uid", async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = ordersCollection.deleteMany(query);
            res.json(result);
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Sun Shine Tours server is running');
});

app.listen(port, () => {
    console.log('Server is running port ', port);
});