export const CHANNEL_TYPES = ['general', 'werewolves', 'vote'];

export const GAME_STATES = {
    WAITING: 'En attente',
    IN_PROGRESS: 'En cours',
    FINISHED: 'terminée'
};

export const GAME_PHASES = {
    DAY: 'Jour',
    NIGHT: 'Nuit',
    VOTING: 'voting',
    STARTING: 'Démarrage',
};

export const ACTION_TYPES = {
    // general actions
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    PLAYER_EXCLUDED: 'player_excluded',
    PLAYER_VOTE: 'player_vote',
    // chat message
    CHAT_MESSAGE: 'chat_message',
    // role action
    GENERAL_ACTION: 'general_action',
    HUNTER_SHOT: 'hunter_shot',
    WITCH_POTION: 'witch_potion',
    WEREWOLF_ATTACK: 'werewolf_attack',
    SEER_REVEAL: 'seer_reveal',
    DOCTOR_HEAL: 'doctor_heal',
    PHASE_CHANGE: 'phase_change',
    PLAYER_ELIMINATED: 'player_eliminated',
    // bot action
    BOT_ADDED: 'bot_added',
    // game management
    GAME_EVENT: 'game_event',
    GAME_HISTORY: 'game_history',
    SYSTEM: 'system'
};