const express = require('express');
const app = express();
const port = 3000;
var mongoose = require('mongoose');
const Sauce = require("./sauce")
const url = "mongodb+srv://shirlen:shirlen@cluster0.fwheq.mongodb.net/piiquante"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const ObjectID = mongoose.Types.ObjectId;
var db = mongoose.connection;
db.on('Error', console.error.bind(console, "MongoDB connection error"))
app.use(express.json());
app.get('/', (req, res) => {
    res.send(`Hello World!`)
});
app.get('/api/sauces', async (req, res) => {
    let sauces = await Sauce.find({});
    res.send(sauces);
});
app.get('/api/sauces/:id', async (req, res) => {
    let sauce = await Sauce.findOne({_id:ObjectID(req.params.id)});
    res.send(sauce);
});
app.post("/api/sauces", async(req, res)=>{
    let sauce= await Sauce.create(req.body)
    res.send({message:sauce.name})
})
app.listen(port, () => {
    console.log(`Application exemple à l'écoute sur le port ${port}!`)
});