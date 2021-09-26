const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true,
    unique: true 
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports=new mongoose.model("User", UserSchema);