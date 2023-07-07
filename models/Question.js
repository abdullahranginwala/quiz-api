const { default: mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
    text: String,
    options: [String],
    correctAnswer: [Boolean],
  });
  
  const Question = mongoose.model('Question', questionSchema);
  module.exports = Question;