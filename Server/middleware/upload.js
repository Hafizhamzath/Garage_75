const multer = require('multer');
const path = require('path');

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Set destination to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  }
});

// Set file filter to allow only certain image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed!'), false); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
