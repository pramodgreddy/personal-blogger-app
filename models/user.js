const mongoose=require('mongoose');

//USER Schema
let userSchema=mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    }

});

let user=module.exports= mongoose.model('User',userSchema);
