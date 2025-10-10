export const CHANNEL_TYPES = ['general', 'werewolves', 'vote'];

export const GAME_STATES = {
    WAITING: 'En attente',
    IN_PROGRESS: 'En cours',
    FINISHED: 'terminée'
};

export const GAME_PHASES = {
    DAY: 'day',
    NIGHT: 'nuit',
    VOTING: 'voting'
};

export const ACTION_TYPES = {
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    PLAYER_EXCLUDED: 'player_excluded',
    CHAT_MESSAGE: 'chat_message',
    PLAYER_VOTE: 'player_vote',
    WEREWOLF_ATTACK: 'werewolf_attack',
    SEER_REVEAL: 'seer_reveal',
    DOCTOR_HEAL: 'doctor_heal',
    PHASE_CHANGE: 'phase_change',
    PLAYER_ELIMINATED: 'player_eliminated',
    GAME_EVENT: 'game_event',
    BOT_ADDED: 'bot_added',
    SYSTEM: 'system'
};