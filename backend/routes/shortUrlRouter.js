const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const ShortUrl = require('../models/shortUrl');
const { isLoggedin } = require('../middlewares/auth');
const Analytics = require('../models/analyticsModel');
const router = express.Router();

router.post('/shortUrl',isLoggedin, async(req, res) => {
  const { originalUrl, remarks, expirationDate } = req.body;

  if(!originalUrl && !remarks){
    return res.status(400).json({message: 'Both fields required!'});
  }

  try {
    const existingUrl = await ShortUrl.findOne({ originalUrl });

    if(existingUrl){
      return res.status(400).json({message: 'Url already exists', existingUrl});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedFull = await bcrypt.hash(originalUrl, salt);
    const hashedUrl = hashedFull.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7);
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    let deviceType = 'Desktop';
    if (userAgent.includes('mobile')) deviceType = 'Mobile';
    else if (userAgent.includes('tablet')) deviceType = 'Tablet';
    
    const shortUrl = new ShortUrl({
      originalUrl,
      hashedUrl,
      remarks,
      expirationDate,
      userId: req.user.id,
      ipAddress: ipAddress,
      userDevice: deviceType,
    });
    await shortUrl.save();


    return res.status(201).json({ message: 'Short Url Generated', shortUrl });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Unable to generate Short Url'});
  }
})

router.put('/shortUrl/:id', isLoggedin, async(req, res) => {
  try {
    const { id } = req.params;
    const { expirationDate, originalUrl, remarks } = req.body;

    if(!id){
      return res.status(400).json({ message: "wrong parameters"});
    }

    const shortUrl = await ShortUrl.findOne({ _id: id });

    if(!shortUrl){
      return res.status(400).json({ message: "Short Url Not Found" });
    }

    if (originalUrl) {
      shortUrl.originalUrl = originalUrl;
    }
    if (remarks) {
      shortUrl.remarks = remarks;
    }
    if (expirationDate) {
      shortUrl.expirationDate = new Date(expirationDate);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedFull = await bcrypt.hash(originalUrl, salt);
    const hashedUrl = hashedFull.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7);

    if(hashedUrl){
      shortUrl.hashedUrl = hashedUrl
    }

    await shortUrl.save();

    return res.status(200).json({ message: 'Short URL Updated successfully', shortUrl });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error updating shortUrl" })
  }
});

router.delete('/shortUrl/:id', isLoggedin, async(req, res) =>{
  try {
    const { id } = req.params;

    if(!id){
      return res.status(400).json({ message: "invalid or wrong id"});
    }

    const deletedUrl = await ShortUrl.findByIdAndDelete(id);
      return res.status(200).json({ message: 'short url deleted successfully', deletedUrl});

  } catch (error) {
    console.log(error);
  }
})

router.get('/shortUrl/:hashedUrl', async (req, res) => {
  try {
    const { hashedUrl } = req.params;

    if (!hashedUrl) {
      return res.status(400).json({ message: 'Wrong or empty hashedUrl' });
    }

    const shortUrl = await ShortUrl.findOne({ hashedUrl });
    if (!shortUrl) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    let deviceType = 'Desktop';
    if (userAgent.includes('mobile')) deviceType = 'Mobile';
    else if (userAgent.includes('tablet')) deviceType = 'Tablet';

    

    const currentDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);

      return `${day}-${month}-${year}`;
    };

    shortUrl.clicks += 1;
    await shortUrl.save();

    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = new Analytics({
        totalClicks: 0,
        clicksByDate: [],
        clicksByDevice: [],
        userId,
      });
    }

    // Update total clicks
    analytics.totalClicks += 1;
    analytics.userId = shortUrl.userId;

    const today = currentDate();

    const dateIndex = analytics.clicksByDate.findIndex((entry) => entry.date === today);
    if (dateIndex !== -1) {
      analytics.clicksByDate[dateIndex].clicks += 1;
    } else {
      analytics.clicksByDate.push({ date: today, clicks: 1 });
    }

    const deviceIndex = analytics.clicksByDevice.findIndex((entry) => entry.device === deviceType);
    if (deviceIndex !== -1) {
      analytics.clicksByDevice[deviceIndex].clicks += 1;
    } else {
      analytics.clicksByDevice.push({ device: deviceType, clicks: 1 });
    }

    await analytics.save();

    return res.redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error in getting URL' });
  }
});

// route to get single url

router.get('/singleurl/:id', isLoggedin, async(req, res) => {
  try {
    const {id} = req.params;
    const singleUrl = await ShortUrl.findOne({_id: id})
    if(!singleUrl){
      return res.status(400).json({ message: 'No url Found'});
    }
    return res.status(200).json({ message: 'Url Fetched', singleUrl });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error in getting signle url'})
  }
})





module.exports = router;