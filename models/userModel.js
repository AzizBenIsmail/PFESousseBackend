const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{12,}$/,
    "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ],
  },
  role: { type: String, enum: ["client", "admin", ".."] },
  age: Number,
  user_Image: { type: String, require: false, default: "client.png" },
  isActive: Boolean,
  isBanned: Boolean,
  //coa

  //mem

  //admin

  //client

  //car: {type : mongoose.Schema.Types.ObjectId , ref:'Car'}, //one
  cars: [{type : mongoose.Schema.Types.ObjectId , ref:'Car'}] //many
},{timestamps:true});

userSchema.pre('save',async function (next) {
  try {
    const salt = await bcrypt.genSalt()
    const User = this 
    User.password = await bcrypt.hash(User.password,salt)
    User.isActive = false    
    next()
  } catch (error) {
    next(error)
  }  
})

userSchema.statics.login = async function (email , password) {
  const user = await this.findOne({email})
  if(user){
    const auth = await bcrypt.compare(password, user.password)    
    if(auth){
      return user
    }
    throw new Error('incorrect password')
  }
  throw new Error("incorrect email");

}

const User = mongoose.model("User",userSchema)
module.exports= User;