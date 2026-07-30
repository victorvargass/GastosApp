import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useMemo } from "react";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint:
    "https://accounts.google.com/o/oauth2/v2/auth",

  tokenEndpoint:
    "https://oauth2.googleapis.com/token",

  revocationEndpoint:
    "https://oauth2.googleapis.com/revoke",
};

const CLIENT_ID =
  "310919587145-jq3tit5t1shu4vomuskc7j3m0todgkvg.apps.googleusercontent.com";

export function useGoogleDriveService() {
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] =
    AuthSession.useAuthRequest(
      {
        clientId: CLIENT_ID,

        scopes: [
          "openid",
          "profile",
          "email",
          "https://www.googleapis.com/auth/drive.appdata",
        ],

        responseType: "token",

        redirectUri,
      },
      discovery
    );

  const accessToken = useMemo(() => {
    if (response?.type !== "success") return null;

    return response.authentication?.accessToken ?? null;
  }, [response]);

  return {
    request,
    response,
    accessToken,
    login: () => promptAsync(),
  };
}