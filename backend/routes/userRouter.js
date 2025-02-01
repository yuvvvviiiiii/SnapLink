const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const User = require('../models/userModel');
const router = express.Router();

const {isLoggedin} = require('../middlewares/auth');

router.post('/user/register', async (req, res) => {
  const { name, email, password, mobilenumber } = req.body;

  if(!name || !email || !password || !mobilenumber){
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const isUserExist = await User.findOne({ email });

    if(isUserExist) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await new User({
        name,
        email,
        mobilenumber,
        password: hashedPassword,
      }).save();
      const token = jwt.sign({ email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

      return res.status(201).json({message: 'User created successfully', token, id: newUser._id, username: newUser.name });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/user/login', async(req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: 'Email Invalid' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch) {
      return res.status(400).json({ message: 'Password Invalid' });
    }

    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    return res.status(200).json({ message: 'Login successful', token, id: user._id, username: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/user/update', isLoggedin, async (req, res) => {
  try {
    const { name, email, mobilenumber } = req.body;

    // if(!name || !email || !mobilenumber){
    //   res.status(400).json({ message: 'Fill atleast one field' });
    // }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(name) user.name = name;
    if(email) user.email = email;
    if(mobilenumber) user.mobilenumber = mobilenumber;

    user.save();
    return res.status(200).json({ message: 'User updated successfully' , user})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

router.get('/user', isLoggedin, async(req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User data fetched', user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

router.delete('/user/delete', isLoggedin, async(req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if(user){
      return res.status(200).json({ message: 'User deleted sucessfully', user })
    } else return res.status(400).json({message: 'Error in deleting User'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "server error"})
  }
})

module.exports = router;