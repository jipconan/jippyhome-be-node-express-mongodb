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

// Route to handle file upload
router.post('/upload', async (req, res) => {
  try {
    // Log Request files
    console.log("Client/cloudinary Request Files: ", req.files); 

    // Log Request folder
    console.log("Client/cloudinary Request Files: ", req.body.folder); 

    // Comes back no file upload error
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // Define File and Folder with their respective variable
    const file = req.files.image;
    const folder = req.body.folder;

    // Upload to cloudinary with PRESET name and folder name
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        upload_preset: process.env.CLOUDINARY_PRESET,
        folder: folder,
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
