const User=require('../models/Admin')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register=async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({
        name,
        email,
        password,
        role,
      });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      res.send('User registered successfully');
    } catch (err) {
      res.status(500).send('Server error');
    }
  }

const login=async (req, res) => {
    const { email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      console.log(role)
      console.log(user)
      
      if (user && user.role === role) {
        // Proceed with your logic if the user is valid and has the correct role
    } else {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // JWT generation
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
  
      jwt.sign(
        payload,
        'mySecretKey',  // Replace with config or .env variable
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  }

module.exports={register,login}