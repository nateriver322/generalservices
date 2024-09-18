import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "d2a969c7-b63d-4c95-9d1c-2bcaf8b09034",
    authority: "https://login.microsoftonline.com/823cde44-4433-456d-b801-bdf0ab3d41fc",
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const msalInstance = new PublicClientApplication(msalConfig);