import { storePendingMatch, queryPendingMatches, removeMatch} from './repository.js';

export async function ormStorePendingMatch(params) {
    try {
        const pendingMatch = await storePendingMatch(params);
        await pendingMatch.save();
        return true;
    } catch (err) {
        console.error(err);
        return { err };
    }
}

export async function ormQueryPendingMatch(params) {
    return await queryPendingMatches(params)
}

export async function ormRemoveMatch(params) {
    return await removeMatch(params)
}