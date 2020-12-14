const express=require('express');
const router=express.Router();

//bring in post models
let Post=require('../models/post');
//bring in user cmodel
let User=require('../models/user');

//Route to Add post
router.get('/add',ensureAuth, function(req,res){

  res.render('add_post',{
    title:'ADD POST'
  });
});


//post submit route
router.post('/add',function(req,res){

  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('body','body is required').notEmpty();
  req.checkBody('category','Category is required').notEmpty();
  req.checkBody('newstype','NewsType is required').notEmpty();
  req.checkBody('eventtype','EventType is required').notEmpty();
  // req.checkBody('username','Username is required').notEmpty();
  // req.checkBody('author','Status is required').notEmpty();


  let errors=req.validationErrors();
  if(errors){
    res.render('add_post',{
      title:'Add Post',
      errors:errors
    });
  }else{
    let post= new Post();
    // console.log(req.body.title);
    post.title=req.body.title;
    post.body=req.body.body;
    post.category=req.body.category;
    post.news=req.body.newstype;
    post.events=req.body.eventtype;
    post.username=req.user._id;
    // console.log(post.username);
    // post.user.status=req.body.author;

    post.save(function(err) {
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Post Added');
        res.redirect('/');
      }
    });
  }
});



// Load edit form
router.get('/edit/:id', ensureAuth, function(req,res) {
  Post.findById(req.params.id,function (err,post) {
    if(post.username != req.user._id){
      req.flash('danger','Not authorised!');
      res.redirect('/');
    }
    res.render('edit_post',{
      title:"EDIT POST",
      post:post
    });


  });
});


//update Submit
router.post('/edit/:id',function(req,res){
  var post={};
  // let post= new Post();
  // post.user=req.body.username;
  // console.log(post.user);
  // post.user=req.body.author;
  // console.log(post.user);
  //
  // return;
    post.title=req.body.title;
    post.body=req.body.body;
    post.category=req.body.category;
    post.news=req.body.newstype;
    post.events=req.body.eventtype;
    // post.username=req.body.name;
    // post.user=req.body.author;

    let query={_id:req.params.id};

    Post.update(query,post,function(err) {
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Post Updated');
        res.redirect('/');
      }
    });
});


router.delete('/:id',function (req,res) {
  if(!req.user._id){
    res.status(500).send();
  }

  let query={_id:req.params.id};
  Post.findById(req.params.id,function(err,post) {
    // console.log(req.user._id);
    // console.log(post.name);
    if(post.username != req.user._id){
      res.status(500).send();
    }
    else{
      Post.remove(query,function(err) {
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});


//get singe post
router.get('/:id',function(req,res) {
  Post.findById(req.params.id,function (err,post) {
    User.findById(post.username,function(err,user) {
      // console.log(post.username);
      // console.log(user.name);
      res.render('post',{
        post:post,
        username:user.name
    });
    });
  });
});



//ACCESS controls
function ensureAuth(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}


module.exports=router;
