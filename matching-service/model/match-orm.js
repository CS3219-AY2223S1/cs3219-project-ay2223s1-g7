import { storePendingMatch, queryPendingMatches, removeMatch } from './repository.js';

export async function ormStorePendingMatch(username, difficulty, roomId) {
    try {
        const pendingMatch = await storePendingMatch({ username, difficulty, roomId });
        await pendingMatch.save();
        return true;
    } catch (err) {
        console.error(err);
        return { err };
    }
}

export async function ormQueryPendingMatch(difficulty) {
    return await queryPendingMatches({ difficulty })
}

export async function ormRemoveMatch(difficulty) {
    try {
        await removeMatch({ difficulty })
    } catch (err) {
        console.error(err)
        return { err }
    }
}