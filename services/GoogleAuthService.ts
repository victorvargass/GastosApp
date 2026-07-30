import {
  GoogleSignin,
  type User,
} from '@react-native-google-signin/google-signin';

export const GOOGLE_WEB_CLIENT_ID =
  '310919587145-jq3tit5t1shu4vomuskc7j3m0todgkvg.apps.googleusercontent.com';

export const GOOGLE_DRIVE_APPDATA_SCOPE =
  'https://www.googleapis.com/auth/drive.appdata';

export type GoogleUser = User['user'];

let configured = false;

export class GoogleAuthService {
  static configure(): void {
    if (configured) return;

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['email', 'profile'],
      offlineAccess: false,
    });

    configured = true;
  }

  static async signIn(): Promise<GoogleUser> {
    this.configure();

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const response = await GoogleSignin.signIn();

    if (response.type !== 'success') {
      throw new Error('Inicio de sesión cancelado');
    }

    await this.requestDriveAccess();
    return response.data.user;
  }

  static async requestDriveAccess(): Promise<void> {
    this.configure();

    const response = await GoogleSignin.addScopes({
      scopes: [GOOGLE_DRIVE_APPDATA_SCOPE],
    });

    if (response?.type === 'cancelled') {
      throw new Error('Se canceló el permiso para Google Drive');
    }
  }

  static async restoreSession(): Promise<GoogleUser | null> {
    this.configure();

    if (!GoogleSignin.hasPreviousSignIn()) {
      return null;
    }

    try {
      const response = await GoogleSignin.signInSilently();

      if (response.type !== 'success') {
        return null;
      }

      try {
        await this.requestDriveAccess();
      } catch {
        // The Google account can still be restored even if Drive access
        // has not been granted yet. A backup operation will request it again.
      }

      return response.data.user;
    } catch {
      return null;
    }
  }

  static async getAccessToken(): Promise<string> {
    this.configure();

    // Drive access is an additional authorization scope on Android.
    // Calling addScopes again is safe when it has already been granted.
    await this.requestDriveAccess();

    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  }

  static getCurrentUser(): GoogleUser | null {
    this.configure();
    return GoogleSignin.getCurrentUser()?.user ?? null;
  }

  static async signOut(): Promise<void> {
    this.configure();
    await GoogleSignin.signOut();
  }
}
