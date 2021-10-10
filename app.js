const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");
const fileUpload = require('express-fileupload');
// Setting Up Multer
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads' });

const app = express();

// Have express use Multer Middleware
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));
app.use(fileUpload());

const posts = [];

console.log(posts)



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

app.post("/compose",upload.single('imageFile'), function(req, res, next) {
  
  // Use destructuring to receive request body ( blog title & body)
  const {postTitle, postBody} = req.body
  console.log(postTitle,postBody)

  // Write simple conditional to check if req.files object is populated
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }
  
  // Request file coming from front end
  let newImage = req.files.imageFile.name
  // Specify upload path
  let uploadPath = require('path').resolve('./compose') + '\\public\\uploads\\' + newImage;

  

  // Make sure to save path to image in post object
  const post = {
    image: uploadPath,
    title: postTitle,
    content: postBody
  };

  posts.push(post);

  res.redirect("/blog");
  // console.log(posts)
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
        content: post.content,
        // Send location of your image to front end
        imageDir:post.image
      });
    }
  });
});










app.listen(3000, function() {
  console.log("Server running on port 3000");
});
