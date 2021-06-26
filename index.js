const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hello i'm working");
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0q0ko.mongodb.net/${process.env
    .DB_NAME}?retryWrites=true&w=majority`;
    
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {

    const adminCollection = client.db('smart-blog').collection('admins');
    // console.log('error',err );
    const blogCollection = client.db('smart-blog').collection('blogs');

    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        // console.log('adding new event: ', newBlog)
        blogCollection.insertOne(newBlog).then((result) => {
            // console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    });

    app.get('/admin', (req, res) => {
        adminCollection.find().toArray((err, items) => {
            // console.log(items);
            res.send(items);
        })
    })

    app.get('/blogs', (req, res) => {
        blogCollection.find().toArray((err, items) => {
            res.send(items);
        })
    })
    app.get('/blog', (req, res) => {
        console.log(req.query.id);
        id = req.query.id;
        blogCollection.find({ _id: ObjectId(id) }).toArray((err, items) => {
            // console.log({ err }, { items });
            res.send(items);
        })
    })

    app.delete('/deleteBlog/:id', (req, res) => {
        console.log(req.params.id);
        blogCollection.deleteOne({ _id: ObjectId(req.params.id) });
    })
})


    app.listen(port);