let mongoose=require('mongoose');

//article Schema
let postSchema=mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    body:{
      type:String,
      required:true
    },
    category:{
      type:String,
      required:true
    },
    news:{type:String,
        required:true},
    events:{type:String,
        required:true},
    username:
      {type:String,
      required:true},
    date: { type: Date, default: Date.now }
});

let post=module.exports= mongoose.model('Post',postSchema);
