const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [Number],  // The indices of the options each question was answered with
  score: Number,
});

const Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;
