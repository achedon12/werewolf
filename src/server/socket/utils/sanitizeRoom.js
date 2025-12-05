export const sanitizeRoom = (room, maxDepth = 6) => {
    const seen = new WeakMap();

    const isSocketLike = (obj) =>
        obj && typeof obj === 'object' && typeof obj.emit === 'function' &&
        (obj.id || obj.handshake || obj.connected !== undefined);

    const sanitize = (value, depth = 0) => {
        if (depth > maxDepth) return undefined;
        if (value === null || typeof value !== 'object') return value;
        if (isSocketLike(value)) return undefined;
        if (value instanceof Date) return value.toISOString();

        if (seen.has(value)) return seen.get(value);

        if (Array.isArray(value)) {
            const arr = [];
            seen.set(value, arr);
            for (const item of value) arr.push(sanitize(item, depth + 1));
            return arr;
        }

        if (value instanceof Map) {
            const arr = [];
            seen.set(value, arr);
            for (const [, v] of value.entries()) arr.push(sanitize(v, depth + 1));
            return arr;
        }

        if (value instanceof Set) {
            const arr = [];
            seen.set(value, arr);
            for (const v of value.values()) arr.push(sanitize(v, depth + 1));
            return arr;
        }

        const out = {};
        seen.set(value, out);

        for (const key of Object.keys(value)) {
            if (key.startsWith('_')) continue;
            if (key === 'socket') continue;
            const v = value[key];
            if (typeof v === 'function') continue;
            out[key] = sanitize(v, depth + 1);
        }

        return out;
    };

    return sanitize(room, 0);
};

export const normalizePlayers = (players) => {
    if (!players) return new Map();
    if (players instanceof Map) return players;
    const map = new Map();
    if (Array.isArray(players)) {
        players.forEach(p => {
            const key = p.socketId || p.id;
            if (key) {
                map.set(String(key), {...p});
            }
        });
    } else if (typeof players === 'object') {
        // cas où players est un objet indexé par socketId
        Object.keys(players).forEach(k => map.set(String(k), players[k]));
    }
    return map;
};