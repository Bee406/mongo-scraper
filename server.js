var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(err) {
    if (err) throw err;
    console.log('connection succesful');
});

app.get("/scrape", function (req, res) {
    axios.get("http://blog.thediscoverer.com/tag/travel-tales/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {

            var result = {};

            result.headline = $(element).text();
            result.url = "http://blog.thediscoverer.com" + $(element).parent().parent().attr("href");
            result.summary = $(element).parent().parent().children(".post-card-excerpt").children().text();

            var photoLink = $(element).parent().parent().parent().parent().children(".post-card-image-link").children().attr("style");
            photoLink = photoLink.replace(")", "(").split("(");

            result.photoLink = photoLink[1];

            console.log(result);
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    //return res.json(err);
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

