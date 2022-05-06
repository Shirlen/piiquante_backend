const express = require('express');
const app = express();
const port = 3000;
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Sauce = require("./sauce")
const User = require("./user");
const jwt = require("jsonwebtoken")
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
            let token = jwt.sign({ user: user }, "1234")
            res.send({
                userId: user.id, token: token
            })
        } else {
            res.status(400).json({ error: "password not valid" })
        }
    } else {
        res.status(401).json({ error: "user not exist" })
    }
})
app.delete('/api/sauces/:id', async (req, res) => {
    //ON RECUPERE LE CHAMPS AUTHORIZATION
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                // ON RECUPERE LA SAUCE
                let sauce = await Sauce.findOne({ _id: ObjectID(req.params.id) })
                // ON VERIFIE QUE L UTILISATEUR DE LA SAUCE EST BIEN CELUI CONNECTE
                if (user.id == sauce.userId) {
                    //ON A LE DROIT DE LE MODIFIER
                    await Sauce.deleteOne({ _id: ObjectID(req.params.id) })
                    res.send(`sauce delete`)
                }
                else {
                    //ON A PAS LE DROIT DE LE MODIFIER
                    res.sendStatus(403)
                }

            }
        })
    }
    //ON ENVOIE UNE ERREUR QUAND ON A PAS DE TOKEN
    else {
        return res.sendStatus(401)
    }


})

app.post('/api/sauces/:id/like', async (req, res) => {
    //ON RECUPERE LE CHAMPS AUTHORIZATION
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                let userId = req.body.userId
                let like = req.body.like
                let sauceId = req.params.id
                let sauce = await Sauce.findOne({ _id: ObjectID(sauceId) });
                if (like > 0) {
                    sauce.likes += 1
                    sauce.usersLiked.push(userId)
                } else if (like < 0) {
                    sauce.dislikes += 1
                    sauce.usersDisliked.push(userId)
                } else {
                    let isliked = sauce.usersLiked.includes(userId)
                    if (isliked) {
                        sauce.likes -= 1
                        let index = sauce.usersLiked.findIndex((u) => u == userId)
                        sauce.usersLiked.splice(index, 1)
                    } else {
                        sauce.dislikes -= 1
                        let index = sauce.usersDisliked.findIndex((u) => u == userId)
                        sauce.usersDisliked.splice(index, 1)

                    }
                }
                await Sauce.updateOne({
                    _id: ObjectID(sauceId)
                }, {
                    $set: {
                        likes: sauce.likes,
                        usersLiked: sauce.usersLiked
                    }
                })

                res.send(`sauce like`)
            }
        })
    }
    //ON ENVOIE UNE ERREUR QUAND ON A PAS DE TOKEN
    else {
        return res.sendStatus(401)
    }

})

app.get('/api/sauces', async (req, res) => {
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                let sauces = await Sauce.find({});

                res.send(sauces);

            }
        })
    }
    //ON ENVOIE UNE ERREUR QUAND ON A PAS DE TOKEN
    else {
        return res.sendStatus(401)
    }


});
app.get('/api/sauces/:id', async (req, res) => {
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                let sauce = await Sauce.findOne({ _id: ObjectID(req.params.id) });
                res.send(sauce);

            }
        })
    }
    //ON ENVOIE UNE ERREUR QUAND ON A PAS DE TOKEN
    else {
        return res.sendStatus(401)
    }


});
app.post("/api/sauces", async (req, res) => {
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                let sauce = await Sauce.create(req.body)
                res.send({ message: sauce.name })

            }
        })
    }

})
app.put("/api/sauces/:id", async (req, res) => {
    const autorisation = req.headers.authorization
    if (autorisation) {
        //ON EXTRAIT LE TOKEN DE "BEARER TOKEN"
        const token = autorisation.split(" ")[1]
        //ON VERIFIE LE TOKEN PAR RAPPORT AU SECRET QU ON A DEJA DEFINI
        jwt.verify(token, "1234", async (error, user) => {
            //SI UNE ERREUR DE VERIFICATION ON RENVOI LE CODE 403
            if (error) {
                return res.sendStatus(403)
            }
            //SI VERIFICATION OK ON FAIT LE PROCESSUS
            else {
                // ON RECUPERE LA SAUCE
                let sauce = await Sauce.findOne({ _id: ObjectID(req.params.id) })
                // ON VERIFIE QUE L UTILISATEUR DE LA SAUCE EST BIEN CELUI CONNECTE
                if (user.id == sauce.userId) {
                    //ON A LE DROIT DE LE MODIFIER
                    await Sauce.updateOne({ _id: ObjectID(req.params.id) }, req.body)
                    res.send({ message: req.params.id })
                }
                else {
                    //ON A PAS LE DROIT DE LE MODIFIER
                    res.sendStatus(403)
                }

            }
        })
    }

})

app.listen(port, () => {
    console.log(`Application exemple à l'écoute sur le port ${port}!`)
});