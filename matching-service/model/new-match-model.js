function pendingMatchModelSchema(username, difficulty, roomId) {
    return {
        username,
        difficulty,
        roomId,
        createdAt: Date.now()
    }
}

let pendingMatchMap = new Map();

export function storePendingMatch(username, difficulty, roomId) {
    pendingMatchMap.set(
        difficulty, 
        pendingMatchModelSchema(username, difficulty, roomId)
    )
}

export function getPendingMatch(difficulty) {
    return pendingMatchMap.get(
        difficulty
    )
}

export function deletePendingMatch(difficulty) {
    pendingMatchMap.delete(difficulty)
}