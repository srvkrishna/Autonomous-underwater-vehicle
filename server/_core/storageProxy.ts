import type { Express } from "express";
import path from "path";
import fs from "fs";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const publicDir = path.resolve(import.meta.dirname, "../..", "client", "public");

    if (key.includes("sonar-mark")) {
      return res.sendFile(path.join(publicDir, "sonar-mark.svg"));
    }
    if (key.includes("tidal-hero")) {
      return res.sendFile(path.join(publicDir, "tidal-hero.svg"));
    }
    if (key.includes("contour-wave")) {
      return res.sendFile(path.join(publicDir, "contour-wave.svg"));
    }
    if (key.includes("auv-payload")) {
      return res.sendFile(path.join(publicDir, "auv-payload.svg"));
    }
    if (key.includes("WORKFLOW") || key.includes("workflow")) {
      return res.sendFile(path.join(publicDir, "technical-workflow.svg"));
    }

    const candidate = path.join(publicDir, key);
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      return res.sendFile(path.join(publicDir, "sonar-mark.svg"));
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        return res.sendFile(path.join(publicDir, "sonar-mark.svg"));
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        return res.sendFile(path.join(publicDir, "sonar-mark.svg"));
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      return res.sendFile(path.join(publicDir, "sonar-mark.svg"));
    }
  });
}
