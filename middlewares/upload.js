const multer = require('multer')
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');

/**
 * define opts for multer
 */
// storage engine: gridfs  
// url: define database
// bucketName: define collection
const storage = new GridFsStorage({
  url: process.env.MONGOURI || 'mongodb://localhost:27017/test',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: req.params.name,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
      // crypto.randomBytes(16, (err, buf) => {
      //   if (err) {
      //     return reject(err);
      //   }
      //   //define name: asb-xcv-2342197sfas97234.mp3
      //   const extend = path.extname(file.originalname)
      //   let oriNameWithoutExtend = path.basename(file.originalname, extend)
      //   oriNameWithoutExtend = oriNameWithoutExtend.split(' ').join('-')
      //   const filename = oriNameWithoutExtend + '-' + buf.toString('hex') + extend;

      //   const fileInfo = {
      //     filename: filename,
      //     bucketName: 'uploads'
      //   };
      //   resolve(fileInfo);
      // });
    });
  }
});

// check file
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /audio|mpeg|mp3/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb({ file: '!Please input a MP3 file.' });
  }
} // reference: https://github.com/bradtraversy/nodeuploads/blob/master/app.js

/**
 * combine parts to opts
 */
const opts = {
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}

module.exports = multer(opts).single('file')