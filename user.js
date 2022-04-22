var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	email: String,
	password : String,
	

	
	
}, {
	collection: 'Users'
})

var User = mongoose.model('User', userSchema);
module.exports = User;