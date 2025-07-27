// backend/routes/upload.js
import express from 'express';
import upload from '../middlewares/multer.js'; 

const router = express.Router();

router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    const imageUrl = req.file.path; 
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Image upload failed', details: err });
  }
});

export default router;
