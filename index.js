
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const facilityCollections = database.collection('facilities')
        const bookingCollections = database.collection('bookings')

        app.get('/facilities', async (req, res) => {
            const result = await facilityCollections.find().toArray()
            res.send(result)
        })
        app.get('/facilities/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await facilityCollections.findOne(query)
            res.send(result)
        })
        app.post('/bookings', async (req, res) => {
            const booking = req.body
            const result = await bookingCollections.insertOne(booking)
            res.send(result)
        })
        app.get('/bookings/:id', async (req, res) => {
            const { id } = req.params
            const result = await bookingCollections.find({ user_id: id }).toArray()
            res.send(result)
        })

        app.delete('/bookings/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollections.deleteOne(query)
            res.send(result)
        })
        app.post('/facilities', async (req, res) => {
            const facility = req.body
            const result = await facilityCollections.insertOne(facility)
            res.send(result)
        })
        app.get('/facilities/user/:userId', async (req, res) => {
            const { userId } = req.params
            const result = await facilityCollections.find({ user_id: userId }).toArray()
            res.send(result)
        })
        app.delete('/facilities/:id', async (req, res) => {
            const { id } = req.params
            const query = {
                _id: new ObjectId(id)
            }
            const result = await facilityCollections.deleteOne(query)
            res.send(result)
        })
        app.patch('/facilities/:id', async (req, res) => {
            const { id } = req.params
            const data = req.body
            const query = {
                _id: id
            }
            const result = await facilityCollections.updateOne(
                { query },
                { $set: data }
            )
            res.send(result)
        })


        app.get('/', (req, res) => {
            res.send('SportNest server is running')
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

app.listen(port, () => {
    console.log(`SportNest server is running on port ${port}`)
})
