export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

export const formationHoursDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
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

export const formatDurationMs = (ms) => {
    if (!ms || ms <= 0) return "0m 0s";
    const totalSec = Math.round(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

export const parseTimeRange = (raw) => {
    if (!raw) return 7 * 24 * 60 * 60 * 1000;
    const s = String(raw).trim().toLowerCase();

    if (s === "24" || s === "24h" || s === "24hours" || s === "24hour") {
        return 24 * 60 * 60 * 1000;
    }

    const hMatch = s.match(/^(\d+)\s*(h|hours?)$/);
    if (hMatch) return parseInt(hMatch[1], 10) * 60 * 60 * 1000;

    const dMatch = s.match(/^(\d+)\s*(d|days?)$/);
    if (dMatch) return parseInt(dMatch[1], 10) * 24 * 60 * 60 * 1000;

    if (/^\d+$/.test(s)) return parseInt(s, 10) * 24 * 60 * 60 * 1000;

    return 7 * 24 * 60 * 60 * 1000;
}

export const getTimeDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds};
}

export const formatTimeDifference = (startDate, endDate, join = ' ') => {
    const {days, hours, minutes, seconds} = getTimeDifference(startDate, endDate);
    const parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(join);
}