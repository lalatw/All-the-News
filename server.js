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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/allnews", { useNewUrlParser: true });

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