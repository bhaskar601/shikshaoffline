const { truncate } = require("fs/promises");
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: { type: String , required:true },
  class: { type: String, required:true },
  topic: { type: String, required:true },
  question: { type: String, required : true },
  questionImage: {
    type: String,
    required: false,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  hint: {
    text: { type: String, required: false },
    image: { type: String },
    video: { type: String },
  },
  teacherId: {
    type: String,
    ref: "Teacher", 
  },
});

module.exports = mongoose.model("Question", questionSchema);
