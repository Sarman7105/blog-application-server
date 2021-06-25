const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
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

    app.get('/admin', (req, res) => {
        adminCollection.find().toArray((err, items) => {
            // console.log(items);
            res.send(items);
        })
    })
})


app.listen(port);