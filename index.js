const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zd73h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('worldTravel');
        const servicesCollection = database.collection('services');
        const blogsCollection = database.collection('blogs');
        const bookingsCollection = database.collection('bookings');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API for all blogs
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // GET API for bookings
        app.get('/bookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // POST API FOR BOOKING
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log('hit the post api', booking);

            const result = await bookingsCollection.insertOne(booking);
            console.log(booking);
            res.json(booking)
        });

        // DELETE API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })

        // get single data from bookins
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await bookingsCollection.findOne(query);
            res.json(service);
        })

        // update
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const booking = await bookingsCollection.updateOne(filter, updateDoc, options);
            console.log('updated api booking pending', id)
            res.json(booking);

        })

    }
    finally {
        // await client.close();
    }
}
// check again

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running World Travel Server');
});


app.listen(port, () => {
    console.log('Running World Travel Server on port', port);
})