import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Readable } from 'stream';
import { google } from 'googleapis';
import * as csv from 'csv-parser';
@Injectable()
export class FileUploadService {
  uploadCSVFile(file: Express.Multer.File): Promise<any[]> {
    try {
      return new Promise((resolve, reject) => {
        const results = [];
        // createReadStream(file.path)
        const fileStream = new Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
        fileStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
  async authorize() {
    try {
      const jsonData = readFileSync('./apikey.json', 'utf-8');
      const apikeys = JSON.parse(jsonData);

      const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        ['https://www.googleapis.com/auth/drive'],
      );
      await jwtClient.authorize();
      return jwtClient;
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw error;
    }
  }
  async uploadFile(authClient, image: Express.Multer.File, folderId: string) {
    return new Promise((resolve, reject) => {
      const drive = google.drive({ version: 'v3', auth: authClient });
      const name = Date.now() + '-' + image.originalname;
      const fileMetaData = {
        name: name,
        parents: [folderId],
      };
      const fileStream = new Readable();
      fileStream.push(image.buffer);
      fileStream.push(null);

      drive.files.create(
        {
          requestBody: fileMetaData,
          media: {
            mimeType: image.mimetype,
            body: fileStream,
          },
          fields: 'id',
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.data);
          }
        },
      );
    });
  }
}
