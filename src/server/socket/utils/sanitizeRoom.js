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