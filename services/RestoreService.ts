import { DatabaseService } from './DatabaseService';
import { GoogleDriveService } from './GoogleDriveService';

export class RestoreService {
  static async restore(drive: GoogleDriveService): Promise<void> {
    const file = await drive.downloadDatabase();

    if (!file) {
      throw new Error('No existe ningún respaldo en Google Drive.');
    }

    try {
      await DatabaseService.restoreFromFile(file);
    } finally {
      if (file.exists) {
        file.delete();
      }
    }
  }
}
