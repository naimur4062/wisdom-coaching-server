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

    // app.get('/car/:id', (req, res) => {
    //     carsCollection.find({ _id: ObjectId(req.params.id) })
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })



    // app.post('/addOrder', (req, res) => {
    //     const order = req.body;
    //     ordersCollection.insertOne(order)
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })

    // app.get('/orders', (req, res) => {
    //     ordersCollection.find({ email: req.query.email })
    //         .toArray((err, items) => {
    //             res.send(items)
    //         })
    // })

    // app.delete('/delete/:id', (req, res) => {
    //     carsCollection.deleteOne({ _id: ObjectId(req.params.id) })
    //         .then(result => {
    //             console.log(result)
    //         })
    // })

});

app.listen(process.env.PORT || port)