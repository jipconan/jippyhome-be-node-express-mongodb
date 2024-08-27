const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use express-fileupload middleware
router.use(fileUpload({ useTempFiles: true }));

// Route to handle image upload
router.post('/uploadimage', async (req, res) => {
  try {
    // console.log("Client/cloudinary Request Files: ", req.files); 
    // console.log("Client/cloudinary Request Folder: ", req.body.folder); 

    // Check if files are provided
    if (!req.files || !req.files.image) {
      return res.status(400).send('No files were uploaded.');
    }

    const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
    const folder = req.body.folder;

    const uploadPromises = files.map(file => {
      console.log("Uploading file:", file.tempFilePath); 

      return cloudinary.uploader.upload(file.tempFilePath, {
        upload_preset: process.env.CLOUDINARY_PRESET,
        folder: folder,
      }).then(result => result.secure_url);
    });

    const urls = await Promise.all(uploadPromises);

    res.json({ urls });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send({ error: error.message });
  }
});

// Route to handle model upload
router.post('/uploadmodel', async (req, res) => {
  try {
    // console.log("Client/cloudinary Request Files: ", req.files); 
    // console.log("Client/cloudinary Request Folder: ", req.body.folder); 

    if (!req.files || !req.files.model) {
      return res.status(400).send('No file was uploaded.');
    }

    const file = req.files.model;
    const folder = req.body.folder;

    console.log("Uploading file:", file.tempFilePath); 

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'raw', 
      folder: folder,
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
