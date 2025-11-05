export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

export const formatDuration = (sec) => {
    if (sec === null || typeof sec === 'undefined') return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.max(0, sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}