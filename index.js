const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

let maxsize = 2 * 1000 * 1000; // Use correct case

let upload = multer({
  storage: storage,
  limits: {
    fileSize: maxsize, // Fixed from maxSize to maxsize
  },
  fileFilter: function (req, file, cb) {
    let filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes: " + filetypes));
  }
}).single('mypic');

app.get('/', (req, res) => {
  res.render('signup'); // Fixed from resizeBy to res
});

app.post('/upload', (req, res,next ) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.send('File uploaded successfully!');
  });
});

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
