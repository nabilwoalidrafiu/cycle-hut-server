const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
// console.log(process.env.DB_USER, process.env.DB_Name, process.env.DB_PASS);

app.use(cors());
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tktro.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("cycle-hut").collection("events");
  const checkoutCollection = client.db("cycle-hut").collection("checkout");
  
  console.log('database connected')
    app.get('/events', (req, res)=> {

      eventsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
    })

    app.post('/checkout', (req,res)=>{
        const checkOut = req.body;
        checkoutCollection.insertOne(checkOut)
        .then( result => {
            console.log(result)
            res.send(result.insertedCount > 0)
        })
        console.log(checkOut)
        // res.send(checkOut)
    })

    app.get('/order', (req, res) => {
      checkoutCollection.find({email: req.query.email})
      .toArray((err, items) => {
        res.send(items)
      })
    })

    app.get('/events/:_id',(req, res)=>{
      eventsCollection.find({_id: ObjectId(req.params._id)})
      .toArray((err, items) => {
        res.send(items[0])
      })
    })


  app.post('/addEvent', (req, res)=>{
    const newEvent = req.body;
    // console.log('add new event', newEvent);
    eventsCollection.insertOne(newEvent)
    .then(result=> {
      // console.log('inserted count', eventsCollection, result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })
  
  app.delete('/delete/:_id', (req, res)=>{
    // const id = ObjectId(req.params._id);
    eventsCollection.deleteOne({_id: ObjectId(req.params._id)})
    .then(documents => {
      // res.send(!!documents.value)
      console.log(documents)
      // res.redirect('/')
    })
  })
  
});

app.listen(port)