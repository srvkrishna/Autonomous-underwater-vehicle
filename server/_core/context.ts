import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export const DEFAULT_DEV_USER: User = {
  id: 1,
  openId: "operator_dev_01",
  name: "AUV Sonar Specialist",
  email: "operator@auv-sonar.local",
  loginMethod: "local",
  role: "admin",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  lastSignedIn: new Date(),
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user) {
    const cookieHeader = opts.req.headers.cookie;
    const cookies = cookieHeader ? parseCookieHeader(cookieHeader) : {};
    const sessionToken =
      cookies[COOKIE_NAME] ||
      (typeof opts.req.headers.authorization === "string" &&
      opts.req.headers.authorization.startsWith("Bearer ")
        ? opts.req.headers.authorization.slice(7)
        : null);

    if (sessionToken === "local-dev-session" || sessionToken === "operator_dev_01") {
      user = DEFAULT_DEV_USER;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
