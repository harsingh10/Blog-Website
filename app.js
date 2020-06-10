// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require('mongoose');

let newblog = [];
let requestedTitle = "" ;

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true},(err) =>{
  if(err)
    console.log('Initial connection error: ', err);
    else
      console.log("connected success")
}).catch((err) => {
  console.error('connection error: ',err);
});
//creating schema
const itemSchema = new mongoose.Schema({
  postid: Number,
  content: String
});
const blogSchema = new mongoose.Schema({
  postname: String,
  newcontent: String
});

//creating models using blogschema
const item = mongoose.model("item", itemSchema);
const blog = mongoose.model("blog",blogSchema);

//creating default posts
const homecontent = "This is a blog website ,here you can create your own blog and you can post it on the home page,its a simple website that allows you to create your own blog so as to compose a blog you have to just write compose after the link of the website it will take you to the compose page and there you can create ENJOY!!!"


const aboutcontent ="About the website this website is created using express server and RESTful api' are used to fetch and post data to the server from the server and MongoDB compass database is used to store the blog that user create."


const contactcontent = "contact us on ....."



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", function(req,res){

      blog.find(function(err, posts){
      if(err){
        console.log(err);
      }
      else{

        res.render("home" ,{startingContent:homecontent,post:posts});
      }
    })


});
app.get("/about", function(req,res){

  res.render("about", {Content: aboutcontent});

});
app.get("/contact", function(req,res){

  res.render("contact", {Ccontent:contactcontent});

});
app.get("/compose", function(req,res){

  res.render("compose");

});

app.post("/compose", function(req,res){

  const title = _.lowerCase(req.body.postTitle);
  const content = req.body.postBody;

  const newpost = new blog({
    postname:title,
    newcontent:content
  });
  newpost.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});


app.get("/post/:postId", function (req, res) {

    let requestedId =(req.params.postId);
    
    blog.findOne({_id:requestedId},function(err,foundpost){
      if(!err){
          console.log(foundpost._id);
        let storedId = (foundpost._id);
        console.log(storedId);
        if(requestedId == storedId)
        {
          if((foundpost.newcontent).length>100)
          {
              const data = (foundpost.newcontent);
              res.render("post",{newPostTitle:foundpost.postname,newPostContent:foundpost.newcontent});
          }
        }
        else
        {
          console.log("match not found");
        }

      }
      else{
        console.log(err);
      }
    })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
