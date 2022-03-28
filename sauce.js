var mongoose = require('mongoose');
var sauceSchema = mongoose.Schema({
	name: String,
	description:String
}, {
	collection: 'Sauces'
})

var Sauce = mongoose.model('Sauce', sauceSchema);
module.exports = Sauce;