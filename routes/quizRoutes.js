const Attempt = require('../models/Attempt');

// Create a new quiz
router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { title, description, user } = req.body;
  
      const newQuiz = new Quiz({
        title,
        description,
        user
      });
  
      await newQuiz.save();
  
      return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Fetch a specific quiz
  router.get('/:id', async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      return res.status(200).json({ quiz });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add a question to a quiz
  router.post('/:id/question/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { text, options, correctAnswer } = req.body;
  
      const quiz = await Quiz.findById(req.params.id);
  
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      quiz.questions.push({ text, options, correctAnswer });
  
      await quiz.save();
  
      return res.status(201).json({ message: "Question added successfully", quiz });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Attempt a quiz
router.post('/:id/attempt', async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      const { user, answers } = req.body;
  
      let score = 0;
      for (let i = 0; i < answers.length; i++) {
        if (JSON.stringify(answers[i]) === JSON.stringify(quiz.questions[i].correctAnswer)) score++;
      }
  
      const attempt = new Attempt({
        user,
        quiz: quiz._id,
        answers,
        score,
      });
  
      await attempt.save();
  
      return res.status(201).json({ message: "Attempt recorded", attempt });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all attempts for a quiz
  router.get('/:id/attempts', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      if (quiz.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const attempts = await Attempt.find({ quiz: quiz._id }).populate('user', 'username');
  
      return res.status(200).json({ attempts });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });