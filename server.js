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

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");




// Routes


// Route for getting all Articles from the db
app.get("/", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        var hbsObject = {
          articles: dbArticle
        };
        res.render("index", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});  

app.get("/saved", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        var hbsObject = {
          articles: dbArticle
        };
        res.render("save", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});    
  

// A GET route for scraping the echoJS website
app.get("/api/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    request("https://www.digitaltrends.com/", function (error, response, html) {
        var $ = cheerio.load(html);
        var results = [];

        $(".m-river--item").each(function (i, element) {

            var title = $(element).find(".m-river--title").text();
            var link = $(element).find("a").attr("href");
            var summary = $(element).find(".m-river--content").text();
            var image = $(element).find("img").attr("src");

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                link: link,
                summary: summary,
                image: image

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


app.get("/api/clear", function(req, res) {
    db.Article.remove({})
      .then(function(dbCleard) {
        console.log(dbCleard)
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});   


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/api/articles/:id", function(req, res) {
    db.Note.find({})
      .then(function(dbNote) {
        var hbsObject = {
          notes: dbNote
        };
        res.render("saved", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});  


app.post("/api/notes/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



app.post("/api/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id}, {saved: true})
        .then(function(dbSaved) {
            console.log(dbSaved)
        });
})

app.post("/api/unsaved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id}, {saved: false})
        .then(function(dbUnSaved) {
            console.log(dbUnSaved)
        });
})




// Start the server
app.listen(PORT, function () {
    console.log("App running on http://localhost" + PORT);
});