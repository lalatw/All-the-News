var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require('request');


// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/allnews", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    request("https://www.digitaltrends.com/", function (error, response, html) {
        var $ = cheerio.load(html);
        var results = [];

        $("h3.m-river--title").each(function (i, element) {

            var title = $(element).text();
            var link = $(element).children().attr("href");
            var summary = $(element).nextAll(".m-river--content").text();

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                link: link,
                summary: summary,

            });

            console.log(results);
        
            db.Article.create(results)
             .then(function(dbArticle) {
                 console.log(dbArticle);
             })
            .catch(function(err) {
                return res.json(err)
            })    

        });


    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    db.Article.find({})
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      })
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    db.Article.find({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle[0]);
    })
    .catch(function(err) {
      res.json(err);
    })
  
});  


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {note: dbNote._id}}, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })

});  

// Start the server
app.listen(PORT, function () {
    console.log("App running on http://localhost" + PORT);
});