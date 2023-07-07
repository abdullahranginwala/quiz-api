const { default: mongoose } = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: String,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questions: [questionSchema],
  });


const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;