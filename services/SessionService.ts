import {
  GoogleAuthService,
  type GoogleUser,
} from './GoogleAuthService';

export class SessionService {
  static async restore(): Promise<GoogleUser | null> {
    return GoogleAuthService.restoreSession();
  }

  static async signIn(): Promise<GoogleUser> {
    return GoogleAuthService.signIn();
  }

  static async getAccessToken(): Promise<string> {
    return GoogleAuthService.getAccessToken();
  }

  static async signOut(): Promise<void> {
    await GoogleAuthService.signOut();
  }

  static getCurrentUser(): GoogleUser | null {
    return GoogleAuthService.getCurrentUser();
  }
}
