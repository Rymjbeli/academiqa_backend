import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Readable } from 'stream';
import { google } from 'googleapis';
import * as csv from 'csv-parser';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
@Injectable()
export class FileUploadService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_CONTAINER_NAME;
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient =
      this.blobServiceClient.getContainerClient(containerName);
  }

  async onModuleInit() {
    await this.listContainers();
  }

  async listContainers(): Promise<void> {
    try {
      console.log('Listing containers...');
      for await (const container of this.blobServiceClient.listContainers()) {
        console.log(`- ${container.name}`);
      }
    } catch (error) {
      console.error('Error listing containers:', error.message);
    }
  }

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

  async uploadFile(
    image: Express.Multer.File,
    folderPath: string,
  ): Promise<any> {
    try {
      const blobName = `${folderPath}/${Date.now()}-${image.originalname}`;
      console.log('Container client:', this.containerClient);
      const blockBlobClient: BlockBlobClient =
        this.containerClient.getBlockBlobClient(blobName);

      console.log('Creating Readable stream from file buffer...');
      const fileStream = new Readable();
      fileStream.push(image.buffer);
      fileStream.push(null);

      console.log('Starting upload to Azure Blob Storage...');
      console.log('Blob name:', blobName);
      console.log('Blob URL:', blockBlobClient.url);

      const uploadResponse = await blockBlobClient.uploadStream(
        fileStream,
        image.buffer.length,
        undefined,
        {
          onProgress: (ev) => console.log('Progress:', ev.loadedBytes),
        },
      );

      console.log('Upload response:', uploadResponse);

      return {
        url: blockBlobClient.url,
        uploadResponse,
      };
    } catch (error) {
      console.error('Error occurred during file upload:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
