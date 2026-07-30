import { File, Paths } from 'expo-file-system';
import { fetch, type FetchRequestInit } from 'expo/fetch';

const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
const BACKUP_NAME = 'gastosapp-backup.db';

export type DriveBackup = {
  id: string;
  name: string;
  modifiedTime: string;
};

type TokenProvider = () => Promise<string>;

export class GoogleDriveService {
  constructor(private readonly getAccessToken: TokenProvider) {}

  private async request(
    url: string,
    init: Omit<FetchRequestInit, 'headers'> = {}
  ): Promise<Response> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(url, {
      ...init,
      // expo/fetch expects a serializable header map on Android. The browser
      // Headers class is not accepted by its native bridge.
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Google Drive respondió ${response.status}${body ? `: ${body}` : ''}`
      );
    }

    return response;
  }

  async listBackups(): Promise<DriveBackup[]> {
    const query = encodeURIComponent(
      `name = '${BACKUP_NAME}' and trashed = false`
    );

    const response = await this.request(
      `${DRIVE_API}?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`
    );

    const data = (await response.json()) as { files?: DriveBackup[] };
    return data.files ?? [];
  }

  async getLatestBackup(): Promise<DriveBackup | null> {
    const backups = await this.listBackups();
    return backups[0] ?? null;
  }

  private async deleteFile(fileId: string): Promise<void> {
    await this.request(`${DRIVE_API}/${fileId}`, {
      method: 'DELETE',
    });
  }

  async uploadDatabase(uri: string): Promise<DriveBackup> {
    const file = new File(uri);

    const backups = await this.listBackups();

    // Reuse the existing Drive file when possible. This avoids a delete-then-
    // upload gap and guarantees one logical backup per Google account.
    if (backups.length > 0) {
      const primary = backups[0];

      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `${UPLOAD_API}/${primary.id}?uploadType=media&fields=id,name,modifiedTime`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-sqlite3',
          },
          // Expo File implements Blob. Sending it directly avoids creating a
          // Blob from Uint8Array, which React Native does not support.
          body: file,
        }
      );

      if (!response.ok) {
        throw new Error(
          `No se pudo actualizar el respaldo (${response.status}).`
        );
      }

      // Remove any old duplicates left by previous versions of the app.
      for (const duplicate of backups.slice(1)) {
        await this.deleteFile(duplicate.id);
      }

      return (await response.json()) as DriveBackup;
    }

    const metadata = {
      name: BACKUP_NAME,
      parents: ['appDataFolder'],
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      })
    );
    // Expo File implements Blob and is supported by FormData in Expo SDK 54.
    form.append('file', file);

    const response = await this.request(
      `${UPLOAD_API}?uploadType=multipart&fields=id,name,modifiedTime`,
      {
        method: 'POST',
        body: form,
      }
    );

    return (await response.json()) as DriveBackup;
  }

  async downloadDatabase(): Promise<File | null> {
    const backup = await this.getLatestBackup();
    if (!backup) return null;

    const response = await this.request(
      `${DRIVE_API}/${backup.id}?alt=media`
    );

    const file = new File(
      Paths.cache,
      `gastos-restore-${Date.now()}.db`
    );
    file.write(await response.bytes());
    return file;
  }
}
