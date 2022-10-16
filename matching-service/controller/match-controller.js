import { v4 as uuidv4 } from 'uuid';

import { storePendingMatch, getPendingMatch, deletePendingMatch } from '../model/new-match-model.js'


export function connectMatch(joinRoom, setUpMessage, username, difficulty) {
    try {
        const pendingMatchUser = getPendingMatch(difficulty);
        if (typeof pendingMatchUser === 'undefined') {
            let roomId = uuidv4()
            console.log(`roomId = ${roomId}`)
            let roomName = "room-" + roomId
            storePendingMatch(username, difficulty, roomId);
            joinRoom(roomName)
            setUpMessage(roomName)
        } else {
            // matching
            let pendingUser = pendingMatchUser.username
            console.log(`joining ${pendingMatchUser.roomId}`)
            let roomName = "room-" + pendingMatchUser.roomId
            console.log("matching", pendingUser, username)
            deletePendingMatch(difficulty)
            joinRoom(roomName)
            setUpMessage(roomName)
        }
    } catch (err) {
        return err
    }
}

export function removeMatch(username, difficulty) {
    try {
        let pendingMatchUser = getPendingMatch(difficulty)
        if (typeof pendingMatchUser !== "undefined" && pendingMatchUser.username === username) {
            deletePendingMatch(difficulty)
        }
    } catch (err) {
        console.error(err)
        return err
    }
}
