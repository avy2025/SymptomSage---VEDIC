import express, { type Express, type Request, type Response, NextFunction } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
    const vite = await createViteServer({
        ...viteConfig,
        logLevel: "info",
        server: {
            middlewareMode: true,
            hmr: { server },
        },
        appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;

        try {
            const clientIndexHtml = path.resolve(__dirname, "..", "client", "index.html");
            const template = await fs.promises.readFile(clientIndexHtml, "utf-8");
            const html = await vite.transformIndexHtml(url, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            next(e);
        }
    });
}

export function serveStatic(app: Express) {
    const distPath = path.resolve(__dirname, "..", "dist", "public");

    if (!fs.existsSync(distPath)) {
        throw new Error(
            `Could not find the build directory: ${distPath}. Make sure to build the client first.`
        );
    }

    app.use(express.static(distPath));

    // Fallback to index.html for SPA routing
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}
