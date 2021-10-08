const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");
const fileUpload = require('express-fileupload');




const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(fileUpload());

const posts = [];





app.get("/", function(req, res) {
  res.render("home");
});

app.get("/blog", function(req, res) {
  res.render("blog", {posts: posts});
});

app.get("/", function(req, res){
  res.render("footer");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const email = req.body.email;

                  //Newsletter Signup//
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
        }}],
    update_existing:false
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us5.api.mailchimp.com/3.0/lists/3c06b60d07"
  const options = {
    method: "POST",
    auth: "Morenikeji48:f87dbebbdd3b441257748070c60ff14c-us5"
  };


  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.write("<h1>Successfully subscribed to Olounjeiya Newsletter</h1>");
    } else {
      res.write("Failed to subscribe to Olounjeiya Newsletter</h1>");
    }

  res.send();
  response.on("data", function(data){
    console.log(JSON.parse(data));
      })
  });

  request.write(jsonData);
  request.end();
});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

        //Image//
  let imageFile;
  let uploadPath;
  imageFile = req.body.imageFile;
  uploadPath = require('path').resolve('./compose') + '/public/uploads/' + newImageName;


  const post = {
    image: newImageName,
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/blog");
});

app.get("/about", function(req, res) {
  res.render("about");
});




app.get("/posts/:postName", function(req, res) {
  var requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post) {
    var storedTitle = _.lowerCase(post.title);

    if(requestedTitle === storedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});










app.listen(3000, function() {
  console.log("Server running on port 3000");
});
