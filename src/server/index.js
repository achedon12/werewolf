import {createServer} from "node:http";
import next from "next";
import {initializeSocket} from "./socket/index.js";
import {cleanupInactiveRooms} from "./socket/utils/roomManager.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const startServer = async () => {
    try {
        const app = next({dev, hostname, port});
        await app.prepare();

        const handler = app.getRequestHandler();
        const httpServer = createServer(handler);

        initializeSocket(httpServer, hostname, port);

        setInterval(cleanupInactiveRooms, 5 * 60 * 1000);

        httpServer
            .once("error", (err) => {
                console.error("❌ Erreur du serveur HTTP:", err);
                process.exit(1);
            })
            .listen(port);

        process.on('SIGTERM', () => {
            httpServer.close(() => {
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("❌ Erreur lors du démarrage du serveur:", error);
        process.exit(1);
    }
}

await startServer();