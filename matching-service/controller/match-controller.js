// import { ormStorePendingMatch, ormQueryPendingMatch, ormRemoveMatch } from '../model/match-orm.js'
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

// function getUniqueId(str, seed = 0) {
//     let h1 = 0xdeadbeef ^ seed,
//         h2 = 0x41c6ce57 ^ seed;
//     for (let i = 0, ch; i < str.length; i++) {
//         ch = str.charCodeAt(i);
//         h1 = Math.imul(h1 ^ ch, 2654435761);
//         h2 = Math.imul(h2 ^ ch, 1597334677);
//     }
//     h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
//     h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
//     return 4294967296 * (2097151 & h2) + (h1 >>> 0);
// }

// export async function connectMatch(joinRoom, setUpMessage, username, difficulty) {
//     try {
//         const pendingMatchUser = await ormQueryPendingMatch(difficulty);
//         if (pendingMatchUser.length == 0) {
//             let roomId = uuidv4()
//             console.log(`roomId = ${roomId}`)
//             let roomName = "room-" + roomId
//             await ormStorePendingMatch(username, difficulty, roomId);
//             joinRoom(roomName)
//             setUpMessage(roomName)
//         } else {
//             // matching
//             let pendingUser = pendingMatchUser[0].username
//             let roomName = "room-" + getUniqueId(pendingUser)
//             console.log("matching", pendingUser, username)
//             await ormRemoveMatch(pendingUser, difficulty)
//             joinRoom(roomName)
//             setUpMessage(roomName)
//         }
//     } catch (err) {
//         return err
//     }
// }

// export async function removeMatch(username, difficulty) {
//     try {
//         await ormRemoveMatch(username, difficulty)
//     } catch (err) {
//         return err
//     }
// }