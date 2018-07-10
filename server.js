// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//scrape tool dependencies
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

//make public a static dir
app.use(express.static('public'));

//config database with Mongoose
mongoose.connect('mongodb://localhost/webscraper');
var db = mongoose.connection;

//show if errors
db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});
//success message once connected
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.use(express.static('public'));

// set up Handlebars
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Routes 
//==========
app.get('/', function(req, res) {
	res.render('index');
});

// Now, make a request call for the "webdev" board on reddit. 
// Notice: the page's html gets saved as the callback's third arg
app.get('/scrape', function(req, res) {

	request('https://www.reddit.com/r/news', function (error, response, html) {
  
		// Load the html into cheerio and save it to a var.
		// '$' becomes a shorthand for cheerio's selector commands, 
		//  much like jQuery's '$'.
		var $ = cheerio.load(html);

		// an empty array to save the data that we'll scrape
		var result = {};

		// With cheerio, find each p-tag with a "title" class
		// (i: iterator. element: the current element)
		$('p.title').each(function(i, element){

		  // save the text of the element (this) in a "title" variable
		  result.title = $(this).text();
		  result.link = $(element).children().attr('href');

		  var entry = new Article (result);

		  entry.save(function(err, doc) {
			if (err) {
				console.log(err);
			} else {
				console.log(doc);
			}
		  });
	
		});

		// log the result once cheerio analyzes each of its selected elements
		console.log(result);
	});
	res.send("Scrape Complete");
});

// this will get the articles we scraped from the mongoDB
app.get('/articles', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

//listen on port 3000
app.listen(3000, function() {
	console.log('App running on port 3000');
});