//require mongoose
var mongoose = require('mongoose');

//create schema class
var Schema = mongoose.Schema;

//create Note schema
var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

//create Note model
var Note = mongoose.model('Note', NoteSchema);

//export Note model
module.exports = Note;