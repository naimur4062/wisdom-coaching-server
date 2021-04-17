const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnj3g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('err', err)
    const coursesCollection = client.db("wisdomCoaching").collection("courses");
    const bookingsCollection = client.db("wisdomCoaching").collection("bookings");
    const reviewsCollection = client.db("wisdomCoaching").collection("reviews");
    const adminsCollection = client.db("wisdomCoaching").collection("admins");

    app.post('/addCourse', (req, res) => {
        const newCourse = req.body;
        coursesCollection.insertOne(newCourse)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/courses', (req, res) => {
        coursesCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    });

    app.get('/course/:id', (req, res) => {
        coursesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookingsCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/bookings', (req, res) => {
        bookingsCollection.find({})
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.get('/userBookings', (req, res) => {
        bookingsCollection.find({email: req.query.email})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewsCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    });

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0)
            })
    })

    // app.delete('/delete/:id', (req, res) => {
    //     carsCollection.deleteOne({ _id: ObjectId(req.params.id) })
    //         .then(result => {
    //             console.log(result)
    //         })
    // })

});

app.listen(process.env.PORT || port)