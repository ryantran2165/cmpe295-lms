const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config();


const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
})

module.exports = multer({
  storage: multerS3({
      bucket: "295-bucket",
      s3: s3,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
      }
    }),
});
