require('dotenv').config()
const express = require('express')
const app = express()
const handleUploadingFile = require('./middlewares/upload')
const uri = process.env.MONGOURI
const MongoClient = require('mongodb').MongoClient;
const path = require('path')
// stream files -------------------------------------------
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var conn = mongoose.createConnection(uri);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db);
  // all set!
  gfs.collection('uploads')
})

// body parser
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

// define route---------------------------------------------
app.post('/musics/:name', (req, res) => {
  handleUploadingFile(req, res, (err) => {
    if (err) {
      res.send({ success: false, error: err })
    } else {
      if (req.file == undefined) {
        res.send({ success: false, error: { file: '!Please input a mp3 file.' } })
      } else {
        res.send({ success: true, good: req.file })
      }
    }
  })
})

// @desc: get all file
app.get('/musics', (req, res) => {
  gfs.files.find().sort({ uploadDate: -1 }).toArray(function (err, files) {
    if (err) res.send({ success: false })
    res.send({ success: true, good: files })
  })
})

// @desc: get particular file
app.get('/musics/:id', (req, res) => {
  gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, file) => {
    // check if file
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' })
    }
    const readstream = gfs.createReadStream({ _id: file._id })
    readstream.pipe(res)
  })
})

// @desc: update filename
app.put('/musics/:id', (req, res) => {
  if (!req.body.name) {
    res.send({ success: false, error: { name: "!Please input one." } })
    return
  }

  // // console.log(req.params.id, req.body.name)
  MongoClient.connect(uri, function (err, client) {
    if (err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
    const collection = client.db("test").collection("uploads.files");
    // perform actions on the collection object
    const query = { _id: mongoose.Types.ObjectId(req.params.id) }
    const newvalues = { $set: { filename: req.body.name } }
    collection.updateOne(query, newvalues, (err, rs) => {
      if (err) throw err
      res.send({ success: true })
      client.close();
    })
  });
})

// @desc: delete particular file
app.delete('/musics/:id', (req, res) => {
  // console.log('s')
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err) => {
    if (err) {
      res.send({ success: false })
    } else {
      res.send({ success: true })
    }
  })
})

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}



// start server -----------------------------------------------
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server is started at ${port}`)) 
