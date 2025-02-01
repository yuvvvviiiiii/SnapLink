const express = require('express');
const Analytics = require('../models/analyticsModel');
const { isLoggedin } = require('../middlewares/auth');
const shortUrl = require('../models/shortUrl');
const router = express.Router();

router.get('/analytics', isLoggedin, async (req, res) => {
  try {
    const userId = req.user.id;
    const analytics = await Analytics.findOne({ userId })
  
    if(!analytics){
      return res.status(400).json({ message: 'No analytics Found'});
    }
    
    return res.status(200).json({ message: 'Device Date Analysis', analytics});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error in analytics" });
  }
});

router.get('/allurls', isLoggedin, async (req, res) => {
  try {
    const userId = req.user.id;
    const allurls = await shortUrl.find({ userId });
    if(!allurls){
      return res.status(400).json({ message: 'no urls found'});
    }
    return res.status(200).json({ message: 'All urls Fetched successfully', allurls});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error in getting urls" });
  }
})

module.exports = router;
