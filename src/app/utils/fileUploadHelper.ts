import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as fs from 'fs';
import config from '../config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ICloudinaryResponse, IUploadFile } from '../interface/file';

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// Multer Cloudinary Storage কনফিগারেশন
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let base = 'mahsez';

    if (req.originalUrl.includes('product')) {
      base = 'mahsez/product';
    } else if (req.originalUrl.includes('user')) {
      base = 'mahsez/user';
    } else if (req.originalUrl.includes('blog')) {
      base = `mahsez/blog`;
    }else{
      base = 'mahsez/other';
    }

    const fileName = file.originalname
      .split('.')[0]
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');

    return {
      folder: base,
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
      public_id: `t${Date.now()}-${fileName}`,
      resource_type: 'image',
    };
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  uploadFiles: IUploadFile[],
): Promise<ICloudinaryResponse[]> => {
  const uploadPromises = uploadFiles.map(
    (file) =>
      new Promise<ICloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          (error: Error, result: ICloudinaryResponse) => {
            try {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            } catch (unlinkError) {
              console.error('Error while deleting the file:', unlinkError);
            }

            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
      }),
  );

  return Promise.all(uploadPromises);
};

export const FileUploadHelper = {
  // uploadToCloudinary,
  upload,
};



//////////// Only Single file upload in Object
// const uploadToCloudinary = async (
//   uploadFiles: IUploadFile,
// ): Promise<ICloudinaryResponse | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       uploadFiles.path,
//       (error: Error, result: ICloudinaryResponse) => {
//         fs.unlinkSync(uploadFiles.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       },
//     );
//   });
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//     // cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
