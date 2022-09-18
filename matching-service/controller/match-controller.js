import { ormStorePendingMatch, ormQueryPendingMatch, ormRemoveMatch } from '../model/match-orm.js'


export async function connectMatch(socket, username, difficulty) {
    try {
        const pendingMatchUser = await ormQueryPendingMatch(difficulty);
        let roomName = "room"
        if (pendingMatchUser.length == 0) {
            roomName = roomName + username
            await ormStorePendingMatch(username, difficulty);
        } else {
            // matching
            let pendingUser = pendingMatchUser[0].username
            roomName = roomName + pendingUser
            console.log("matching", pendingUser, username)
            await ormRemoveMatch(pendingUser, difficulty)
        }
        return roomName
        
    } catch (err) {
        return err
    }
}
