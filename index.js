
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sportnest:uxLHy3aGC21eo5wY@cluster0.wb7lpvk.mongodb.net/?appName=Cluster0";

app.use(express.json())
app.use(cors())

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
        await client.connect();

        const database = client.db('sportnest')
        const facultyCollections = database.collection('faculties')

        app.get('/faculties', async (req, res) => {
            const result = await facultyCollections.find().toArray()
            res.send(result)
        })
        
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
