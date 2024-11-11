import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';

let storage;

// Check if the environment is set to use AWS S3
if (process.env.STORAGE_ENGINE === 'S3') {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Generate a unique key for each file, adding the original extension
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
} else {
  // Fallback to local disk storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // Store files in the 'public/uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}

// Set a filter to allow only certain image types
const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(null, false);
  } else if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(
      new Error('Only image files (jpg|jpeg|png|gif) are allowed.'),
      false
    );
  } else {
    return cb(null, true);
  }
};

// Multer upload configuration
export const imageUpload = multer({
  storage,
  fileFilter,
});
