import { Injectable } from '@angular/core';
import { Client, ID, Storage } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  private client = new Client();
  private storage!: Storage;

  private readonly ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
  private readonly PROJECT_ID = '6a1b3601001d67a45096';
  private readonly BUCKET_ID = '6a1b362c001c1a0b1a89';

  constructor() {
    this.client.setEndpoint(this.ENDPOINT).setProject(this.PROJECT_ID);

    this.storage = new Storage(this.client);
  }

  /**
   * @param file
   * @param folder
   */
  async uploadFiles(file: File, folder: string): Promise<string> {
    const fileNameMod = `${folder}_${Date.now()}_${file.name}`;
    const formattedFile = new File([file], fileNameMod, { type: file.type });

    try {
      const result = await this.storage.createFile(this.BUCKET_ID, ID.unique(), formattedFile);

      return `${this.ENDPOINT}/storage/buckets/${this.BUCKET_ID}/files/${result.$id}/view?project=${this.PROJECT_ID}`;
    } catch (err) {
      console.error('Error al subir a Appwrite: ', err);
      throw err;
    }
  }

  /**
   * @param files
   * @param folder
   */
  async uploadMultiFiles(files: File[], folder: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileNameMod = `${folder}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const formattedFile = new File([file], fileNameMod, { type: file.type });

        const result = await this.storage.createFile(this.BUCKET_ID, ID.unique(), formattedFile);

        return `${this.ENDPOINT}/storage/buckets/${this.BUCKET_ID}/files/${result.$id}/view?project=${this.PROJECT_ID}`;
      });

      return await Promise.all(uploadPromises);
    } catch (err) {
      console.error('Error al subir múltiples archivos a Appwrite: ', err);
      throw err;
    }
  }
}
