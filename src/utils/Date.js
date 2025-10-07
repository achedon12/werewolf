export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

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