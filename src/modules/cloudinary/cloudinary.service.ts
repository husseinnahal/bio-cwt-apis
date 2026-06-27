import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  // Uploads in-memory file buffers directly to Cloudinary under a specified folder
  async uploadFile(
    file: { buffer: Buffer },
    folder = 'wood_assets',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder, // Can be custom (e.g. wood_cms, wood_inventory, etc.)
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );

      // Write the buffer to the upload stream
      upload.end(file.buffer);
    });
  }
}
