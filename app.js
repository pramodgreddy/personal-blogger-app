const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const { body, validationResult } = require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const config=require('./config/database');



const app=express();

const PORT= process.env.PORT || 9000;

mongoose.connect(process.env.MONGODB_URI || config.database);
let db=mongoose.connection;


//Check for connection
db.once('open',function () {
  console.log('Connected to mongodb');
});
//CHECK FOR DB ERRORS
db.on('error',function(err){
  console.log(err);
});

//bring in models
let Post=require('./models/post');
//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//set public folder as static
app.use(express.static(path.join(__dirname,'public')));


//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next) {
  res.locals.user= req.user || null;
  next();
});

//Home Route
app.get('/',function(req,res){
  Post.find({},function(err,content) {
    if(err){
      console.log(err);
    }else{
      res.render('index',{
        title:"All Posts",
        posts:content
      });
    }
  });
});

//Route files
let posts= require('./routes/posts');
let users= require('./routes/users');
app.use('/posts',posts);
app.use('/users',users);



// if(proces)
 //To check if server started
app.listen(PORT,function(err){
  if(err){
    console.log(err);
  }else{
    console.log(`server started on port ${PORT}`);
  }
});
