export const findPlayerById = (room, id) => {
    if (!id) return null;
    if (room.players && typeof room.players.get === 'function') {
        return room.players.get(id) || Array.from(room.players.values()).find(p => String(p.id) === String(id)) || null;
    } else if (Array.isArray(room.players)) {
        return room.players.find(p => String(p.id) === String(id)) || null;
    }
    return null;
};