import { storePendingMatch, queryPendingMatches, removeMatch} from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormStorePendingMatch(username, difficulty) {
    try {
        const pendingMatch = await storePendingMatch({username, difficulty});
        pendingMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not store pending match');
        return { err };
    }
}

export async function ormQueryPendingMatch(difficulty) {
    return await queryPendingMatches({difficulty: difficulty})
}

export async function ormRemoveMatch(username, difficulty) {
    return await removeMatch({username: username, difficulty:difficulty})
}