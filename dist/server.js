"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const api_js_1 = require("./routes/api.js");
const IdlixScraperEngine_js_1 = require("./engine/IdlixScraperEngine.js");
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
});
async function main() {
    await fastify.register(cors_1.default, {
        origin: true,
    });
    await fastify.register(api_js_1.apiRoutes);
    const port = parseInt(process.env.PORT || '5376', 10);
    const host = process.env.HOST || '0.0.0.0';
    try {
        await fastify.listen({ port, host });
        console.log(`[Server] Idlix Backend API listening on http://${host}:${port}`);
        // Pre-warm scraper browser session in the background
        IdlixScraperEngine_js_1.IdlixScraperEngine.getInstance().init().catch((err) => {
            console.warn(`[Server] Initial scraper pre-warm notice: ${err?.message}`);
        });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
// Graceful shutdown
const shutdown = async () => {
    console.log('\n[Server] Shutting down gracefully...');
    await IdlixScraperEngine_js_1.IdlixScraperEngine.getInstance().close();
    await fastify.close();
    process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
main();
