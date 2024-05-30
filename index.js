const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middleware;

app.use(cors({
    origin: 'https://sajidimon-portfolio.web.app'
}))

app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcocwar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //db collection

        const userCollection = client.db('EnvoyDB').collection('users')
        const headerinfoCollection = client.db('EnvoyDB').collection('headerinfo')
        const expressCollection = client.db('EnvoyDB').collection('expressProject')


        //USERS API;

        //save users in db;

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const query = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            console.log(result);
            res.send(result)
        })


        //EXPRESS CRUD API;

        // save express projects to db;

        app.post('/express', async (req, res) => {
            const expressData = req.body;
            const result = await expressCollection.insertOne(expressData);
            res.send(result)
        })


        //bring express projects from db;

        app.get('/express', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await expressCollection.find(query).toArray();
            res.send(result)
        })


        //delete express projects from db;

        app.delete('/express/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await expressCollection.deleteOne(query);
            res.send(result);
        })

        //bring express projects data based on id from db to update;


        app.get('/express/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await expressCollection.findOne(query);
            res.send(result)
        })

        app.put('/express/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateExData = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: updateExData
            }
            const result = await expressCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        //HEADERS BIO API;

        //save headerbio to db;

        app.put('/headersbio/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const options = { upsert: true }
            const HeadersBio = req.body;
            const updateDoc = {
                $set: HeadersBio
            }
            const result = await headerinfoCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        //bring headerbio from db;

        app.get('/headersbio/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await headerinfoCollection.find(query).toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})