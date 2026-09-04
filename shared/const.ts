export const COOKIE_NAME = "app_session_id";
export const OAUTH_STATE_COOKIE = "oauth_state";
export const UNAUTHED_ERR_MSG = "UNAUTHORIZED";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function encodeOAuthState(state: { redirectUri: string; nonce: string }) {
  const encoded = encodeURIComponent(JSON.stringify(state));
  return btoa(encoded).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}