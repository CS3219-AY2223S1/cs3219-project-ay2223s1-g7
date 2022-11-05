import { ChangeSet, Text } from "@codemirror/state"

// The Authority for operational transformation implementation
// https://codemirror.net/examples/collab/
export class DocumentHistory {
    constructor(roomNumber) {
        this.updates = []
        this.roomNumber = roomNumber
        this.doc = Text.of([""])
        this.pending = [] // type: function[]
    }

    pullUpdates(data, resp) {
        if (data.version < this.updates.length) {
            resp(this.updates.slice(data.version))
        } else {
            this.pending.push(resp)
        }
    }

    pushUpdates(data, resp) {
        if (data.version != this.updates.length) {
            resp(false)
        } else {
            for (let update of data.updates) {
                // Convert the JSON representation to an actual ChangeSet instance
                let changes = ChangeSet.fromJSON(update.changes)
                this.updates.push({ changes, clientID: update.clientID })
                this.doc = changes.apply(this.doc)
            }
            // Notify pending requests
            while (this.pending.length > 0) {
                let response = this.pending.pop()
                response(data.updates)
            }
            resp(true)
        }
    }

    getDocument(resp) {
        resp({
            version: this.updates.length,
            doc: this.doc.toString()
        })
    }
}