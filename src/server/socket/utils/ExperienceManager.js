import {calculateXpGain} from "../../../utils/Experience.js";

export const awardExperience = async (gameId, winnerIds = [], allPlayerIds = []) => {
    const hostname = "localhost";
    const port = 3000;

    const results = [];

    for (const playerId of allPlayerIds) {
        console.log(`\n🔄 Traitement du joueur ${playerId} pour le jeu ${gameId}...`);
        if (!playerId) continue;
        console.log(`🏆 Attribution XP pour le joueur ${playerId}...`);

        const isWinner = winnerIds.includes(playerId);
        console.log(`   - Statut: ${isWinner ? 'Gagnant' : 'Perdant'}`);
        const xpGained = calculateXpGain(isWinner);
        console.log(`   - XP gagné: ${xpGained}`);

        try {
            const res = await fetch(`http://${hostname}:${port}/api/user/${playerId}/experience`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({xpGained: parseInt(xpGained)})
            });

            console.log(`   - Statut réponse API: ${res.status}`);

            const responseText = await res.text();
            console.log(`   - Réponse brute: ${responseText}`);

            if (res.ok) {
                const data = JSON.parse(responseText);
                results.push({
                    playerId,
                    xpGained,
                    isWinner,
                    newLevel: data.level,
                    leveledUp: data.leveledUp
                });
            }
        } catch (err) {
            console.error(`❌ Erreur attribution XP pour ${playerId}:`, err);
        }
    }

    return results;
};