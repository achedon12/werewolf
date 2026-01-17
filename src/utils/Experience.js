const XP_CONFIG = {
    WIN: {min: 80, max: 150},
    LOSS: {min: 20, max: 50},
    BASE_XP_PER_LEVEL: 100,
    XP_MULTIPLIER: 1.5
};

const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getXpForLevel = (level) => {
    return Math.floor(XP_CONFIG.BASE_XP_PER_LEVEL * Math.pow(XP_CONFIG.XP_MULTIPLIER, level - 1));
};

export const calculateLevel = (totalXp) => {
    let level = 1;
    let xpRequired = 0;

    while (totalXp >= xpRequired + getXpForLevel(level)) {
        xpRequired += getXpForLevel(level);
        level++;
    }

    return level;
};

export const calculateXpGain = (isWinner) => {
    const range = isWinner ? XP_CONFIG.WIN : XP_CONFIG.LOSS;
    return randomBetween(range.min, range.max);
};

export const getXpProgress = (totalXp) => {
    const level = calculateLevel(totalXp);

    let xpForCurrentLevel = 0;
    for (let i = 1; i < level; i++) {
        xpForCurrentLevel += getXpForLevel(i);
    }

    const currentLevelXp = totalXp - xpForCurrentLevel;

    const xpForNextLevel = getXpForLevel(level);

    return {
        level,
        currentLevelXp,
        xpForNextLevel,
        totalXp
    };
};