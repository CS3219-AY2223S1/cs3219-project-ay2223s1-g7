import { v4 as uuidv4 } from 'uuid';

import { ormQueryPendingMatch, ormRemoveMatch, ormStorePendingMatch } from '../model/match-orm.js'

export async function connectMatch(joinRoom, setUpMessage, username, difficulty) {
    try {
        const pendingMatchUser = await ormQueryPendingMatch(difficulty);
        // if (typeof pendingMatchUser === 'undefined') {
        if (pendingMatchUser.length === 0) {
            let roomId = uuidv4()
            console.log(`roomId = ${roomId}`)
            let roomName = "room-" + roomId
            await ormStorePendingMatch(username, difficulty, roomId);
            joinRoom(roomName)
        } else {
            // matching
            let pendingUser = pendingMatchUser[0].username
            console.log(`joining ${pendingMatchUser[0].roomId}`)
            let roomName = "room-" + pendingMatchUser[0].roomId
            console.log("matching", pendingUser, username)
            await ormRemoveMatch(difficulty)
            joinRoom(roomName)
            setUpMessage(roomName)
        }
    } catch (err) {
        return err
    }
}

export async function removeMatch(username, difficulty) {
    try {
        await ormRemoveMatch(username, difficulty)
    } catch (err) {
        console.error(err)
        return err
    }
}
