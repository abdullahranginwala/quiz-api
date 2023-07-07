// Sign up
router.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if(user) return res.status(400).json({ message: "User already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        username,
        password: hashedPassword
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: "User registered successfully" });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Log in
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) return res.status(400).json({ message: "User does not exist" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
  
      const payload = {
        id: user.id,
        username: user.username
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      return res.status(200).json({ message: "Logged in successfully", token: `Bearer ${token}` });
  
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  