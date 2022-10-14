import {
    Box,
    Button,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client"
import { ChangeSet, Text } from '@codemirror/state';
import { ViewPlugin } from '@codemirror/view';
import { receiveUpdates, sendableUpdates, collab, getSyncedVersion } from "@codemirror/collab"

import { getCookie } from "../utils/cookies"
import { Editor } from "./Editor";
import { URL_COLLAB_SVC } from "../configs";
import { border } from "@mui/system";

// codemirror collaboration implementation (operational transformation)
// https://github.com/codemirror/website/blob/master/site/examples/collab/collab.ts
function QuestionPage(props) {
    const [collaboratorName, setCollaboratorName] = useState("")
    const [collabSocket, setCollabSocket] = useState(io())
    const [initDoc, setInitDoc] = useState("")
    const [initVersion, setInitVersion] = useState(0)


    useEffect(() => {
        let username = getCookie("user")
        let roomName = getCookie("room_name")
        setCollabSocket(io(URL_COLLAB_SVC, {
            query: {
                "username": username,
                "roomName": roomName
            },
            closeOnBeforeunload: false
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        collabSocket.on("connectSuccess", async () => {
            let { version, doc } = await getDocument()
            setInitDoc(doc)
            setInitVersion(version)
        })

        collabSocket.on("joinRoomSuccess", (data) => {
            let users = data.users
            console.log(users)
            let username = getCookie("user")
            if (users.length === 2) {
                let collaboratorName = users.filter(name => name !== username)[0]
                console.log(collaboratorName)
                setCollaboratorName(collaboratorName)
            }
        })

        collabSocket.on("collaborator_left", () => {
            setCollaboratorName("")
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collabSocket])

    function pushUpdates(version, fullUpdates) {
        // Strip off transaction data
        let updates = fullUpdates.map(u => ({
            clientID: u.clientID,
            changes: u.changes.toJSON()
        }))
        console.log(collabSocket)
        return new Promise((resolve) => {
            collabSocket.emit('pushUpdates', { version, updates }, (response) => {
                console.log(response)
                resolve(
                    response
                )
            })
        })
    }

    function pullUpdates(version) {
        return new Promise((resolve) => {
            collabSocket.emit('pullUpdates', { version }, (response) => {
                console.log(response)
                resolve(
                    response.map(u => ({
                        changes: ChangeSet.fromJSON(u.changes),
                        clientID: u.clientID
                    }))
                )
            })
        })
    }

    function getDocument() {
        console.log(collabSocket)
        return new Promise((resolve) => {
            collabSocket.emit('getDocument', (response) => {
                resolve({
                    version: response.version,
                    doc: Text.of(response.doc.split("\n"))
                })
            })
        })
    }

    function peerExtension(startVersion) {
        let plugin = ViewPlugin.fromClass(class {
            pushing = false
            done = false

            constructor(view) {
                this.view = view
                this.pull()
            }

            update(update) {
                if (update.docChanged) {
                    this.push()
                }
            }

            async push() {
                let updates = sendableUpdates(this.view.state)
                if (this.pushing || !updates.length) {
                    return
                }
                this.pushing = true
                let version = getSyncedVersion(this.view.state)
                await pushUpdates(version, updates)
                this.pushing = false
                // Regardless of whether the push failed or new updates came in
                // while it was running, try again if there's updates remaining
                if (sendableUpdates(this.view.state).length > 0) {
                    // update frequency to the authority (collab service)
                    setTimeout(() => this.push(), 150)
                }
            }

            async pull() {
                while (!this.done) {
                    let version = getSyncedVersion(this.view.state)
                    let updates = await pullUpdates(version)
                    this.view.dispatch(receiveUpdates(this.view.state, updates))
                }
            }

            destroy() {
                this.done = true
            }
        })
        return [collab({ startVersion }), plugin]
    }

    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h5"} textAlign={"center"} marginBottom={"2rem"}>friend: {collaboratorName}</Typography>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Question</Typography>
            <Editor peerExtension={peerExtension} initVersion={initVersion} initDoc={initDoc} />
            <Button variant={"contained"} color={"error"} onClick={() => { collabSocket.disconnect(); props.handleExit() }}>Exit</Button>
        </Box>
    )
}

export default QuestionPage;