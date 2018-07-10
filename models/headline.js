
//require mongoose
var mongoose = require('mongoose');

//create Schema class
var Schema = mongoose.Schema;

//create Article schema
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	//save and link the Note model
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});
//create Article model
var Article = mongoose.model('Article', ArticleSchema);

//export Article model
module.exports = Article;