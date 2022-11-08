import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';

import { ormQueryPendingMatch, ormRemoveMatch, ormStorePendingMatch } from '../model/match-orm.js'

const mutex = new Mutex();

export async function connectMatch(joinRoom, sendMatchSuccess, username, difficulty) {
    await mutex.runExclusive(async () => {
        const pendingMatchUser = await ormQueryPendingMatch(difficulty);
        if (pendingMatchUser.length === 0) {
            let roomId = uuidv4()
            let roomName = "room-" + roomId
            console.log(`${username}, ${difficulty} pending match in ${roomName}`)
            await ormStorePendingMatch(username, difficulty, roomId);
            joinRoom(roomName)
        } else {
            // matching
            await ormRemoveMatch(difficulty)
            let pendingUser = pendingMatchUser[0].username
            let roomName = "room-" + pendingMatchUser[0].roomId
            console.log(`matching ${pendingUser} & ${username} in ${roomName}`)
            joinRoom(roomName)
            sendMatchSuccess(roomName)
        }
    });

}

export async function removeMatch(difficulty) {
    await mutex.runExclusive(async () => {
        await ormRemoveMatch(difficulty)
    });
}
