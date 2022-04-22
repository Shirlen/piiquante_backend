var mongoose = require('mongoose');
var sauceSchema = mongoose.Schema({
	name: String,
	description:String,
	mainPepper:String,
	imageUrl:String,
	heat: Number,
	likes: Number,
	dislikes: Number,
	userId: String,
	usersLiked:[String],
	usersDisliked:[String],
}, {
	collection: 'Sauces'
})

var Sauce = mongoose.model('Sauce', sauceSchema);
module.exports = Sauce;