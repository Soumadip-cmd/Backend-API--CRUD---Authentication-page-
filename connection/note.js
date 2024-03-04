//it is Notes Schema...
//this is crud operation on a note..
const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userDetail'//not neccesery!
    },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    
  },
  tag: {
    type: String,
    default:"General"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserNote", noteSchema);
