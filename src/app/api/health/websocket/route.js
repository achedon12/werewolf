import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {io} from "socket.io-client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SOCKET_URL = process.env.NODE_ENV === "production"
    ? "https://werewolf.leoderoin.fr"
    : "http://localhost:3000";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
        if (!payload || !payload.id) return NextResponse.json({error: "Token invalide"}, {status: 401});
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }
    if (payload.role && payload.role !== "admin") {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    const timeoutMs = 1500;
    const start = Date.now();
    let resolved = false;
    let t;

    return new Promise((resolve) => {
        const socket = io(SOCKET_URL, {
            autoConnect: false,
            reconnection: false,
            transports: ["polling"],
            timeout: timeoutMs,
            forceNew: true,
        });

        const cleanup = () => {
            try {
                socket.disconnect();
            } catch (e) {
            }
        };

        const done = (ok, details = {}) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(t);
            cleanup();
            const payload = {
                websocket: {
                    status: ok ? "ok" : "down",
                    latencyMs: details.latencyMs ?? null,
                    message: details.message ?? null,
                },
            };
            resolve(NextResponse.json(payload, {status: 200, headers: {"content-type": "application/json"}}));
        };

        socket.on("connect", () => {
            const latency = Date.now() - start;
            done(true, {latencyMs: latency, message: "Connecté"});
        });

        socket.on("connect_error", (err) => {
            done(false, {message: `connect_error: ${err?.message || "unknown"}`});
        });

        socket.on("error", (err) => {
            done(false, {message: `error: ${err?.message || "unknown"}`});
        });

        t = setTimeout(() => {
            done(false, {message: "timeout"});
        }, timeoutMs + 200);

        try {
            socket.connect();
        } catch (e) {
            clearTimeout(t);
            done(false, {message: `exception: ${e?.message || "error"}`});
        }
    });
}