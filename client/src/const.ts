import { COOKIE_NAME, OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const startLogin = async () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;

  if (oauthPortalUrl) {
    const appId = import.meta.env.VITE_APP_ID;
    const redirectUri = `${window.location.origin}/api/oauth/callback`;

    const nonce = crypto.randomUUID();
    document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;
    const state = encodeOAuthState({ redirectUri, nonce });

    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    window.location.href = url.toString();
    return;
  }

  // Local development / operator login fallback
  try {
    sessionStorage.setItem("manus-cookie", `${COOKIE_NAME}=local-dev-session`);
  } catch {}
  document.cookie = `${COOKIE_NAME}=local-dev-session; Path=/; Max-Age=31536000; SameSite=Lax`;
  try {
    await fetch("/api/auth/login", { method: "POST", credentials: "include" });
  } catch {}

  window.location.href = "/";
};
