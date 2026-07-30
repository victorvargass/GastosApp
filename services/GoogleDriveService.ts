const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

export class GoogleDriveService {
  constructor(private accessToken: string) {}

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  async getUser() {
    const res = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: this.headers,
      }
    );

    return await res.json();
  }

  async listBackups() {
    const res = await fetch(
      `${DRIVE_API}?spaces=appDataFolder&q=name='backup.db'&fields=files(id,name,modifiedTime)`,
      {
        headers: this.headers,
      }
    );

    return await res.json();
  }

  async deleteFile(fileId: string) {
    await fetch(`${DRIVE_API}/${fileId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  async uploadDatabase(uri: string) {
    const backup = await this.listBackups();

    if (backup.files?.length) {
      await this.deleteFile(backup.files[0].id);
    }

    const file = await fetch(uri);

    const blob = await file.blob();

    const metadata = {
      name: "backup.db",
      parents: ["appDataFolder"],
    };

    const form = new FormData();

    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })
    );

    form.append("file", blob);

    const res = await fetch(
      `${UPLOAD_API}?uploadType=multipart`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: form,
      }
    );

    return await res.json();
  }

  async downloadDatabase() {
    const backup = await this.listBackups();

    if (!backup.files?.length) return null;

    const fileId = backup.files[0].id;

    const res = await fetch(
      `${DRIVE_API}/${fileId}?alt=media`,
      {
        headers: this.headers,
      }
    );

    return await res.blob();
  }
}