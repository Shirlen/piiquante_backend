const express = require('express');
const app = express();
const port = 3000;
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Sauce = require("./sauce")
const User = require("./user");
const jwt= require("jsonwebtoken")
const url = "mongodb+srv://shirlen:shirlen@cluster0.fwheq.mongodb.net/piiquante"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const ObjectID = mongoose.Types.ObjectId;
var db = mongoose.connection;

db.on('Error', console.error.bind(console, "MongoDB connection error"))
app.use(express.json());
app.get('/', (req, res) => {
    res.send(`Hello World!`)
});
app.post('/api/auth/signup', async (req, res) => {
    let salt = await bcrypt.genSalt(10)
    let newpassword = await bcrypt.hash(req.body.password, salt)
    let user = await User.create({ email: req.body.email, password: newpassword })
    res.send({ message: `user created:${user.email}` })
})

app.post('/api/auth/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        let validpassword = await bcrypt.compare(req.body.password, user.password)
        if (validpassword) {
            let token= jwt.sign({user:user},"1234")
res.send({
    userId:user.id,token:token
})
        } else{
            res.status(400).json({error:"password not valid"})
        }
    } else {
        res.status(401).json({ error: "user not exist" })
    }
})
app.get('/api/sauces', async (req, res) => {
    let sauces = await Sauce.find({});

    res.send(sauces);
});
app.get('/api/sauces/:id', async (req, res) => {
    let sauce = await Sauce.findOne({ _id: ObjectID(req.params.id) });
    res.send(sauce);
});
app.post("/api/sauces", async (req, res) => {
    let sauce = await Sauce.create(req.body)
    res.send({ message: sauce.name })
})
app.put("/api/sauces", async (req, res) => {
    let sauce = await Sauce.create(req.body)
    res.send({ message: sauce.name })
})
app.delete("/api/sauces", async (req, res) => {
    let sauce = await Sauce.create(req.body)
    res.send({ message: sauce.name })
})
app.listen(port, () => {
    console.log(`Application exemple à l'écoute sur le port ${port}!`)
});