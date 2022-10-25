import {
    Box,
    Button,
    Chip,
    Typography
} from "@mui/material";
import React, { useEffect, useState, useContext} from "react";
import { io } from "socket.io-client"
import { ChangeSet, Text } from '@codemirror/state';
import { ViewPlugin } from '@codemirror/view';
import { receiveUpdates, sendableUpdates, collab, getSyncedVersion } from "@codemirror/collab"

import { deleteCookie, getCookie } from "../utils/cookies"
import { Editor } from "./Editor";
import { URL_COLLAB_SVC, URL_QUESTION_SVC } from "../configs";
import VideoPlayer from './VideoPlayer';
import Notifications from './Notifications';
import {Options} from './Options';
import { SocketContext } from "../SocketContext";
import axios from "axios";

// codemirror collaboration implementation (operational transformation)
// https://github.com/codemirror/website/blob/master/site/examples/collab/collab.ts
function QuestionPage(props) {
    const [collaboratorName, setCollaboratorName] = useState("Kenneth")
    const [question, setQuestion] = useState("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. \nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.")
    const [title, setTitle] = useState("Two Sum")
    const [collabSocket, setCollabSocket] = useState(io())
    const [initDoc, setInitDoc] = useState("")
    const [initVersion, setInitVersion] = useState(0)
    const {leaveCall} = useContext(SocketContext);


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

        collabSocket.on("joinRoomSuccess", async (data) => {
            let users = data.users
            console.log(users)
            let username = getCookie("user")
            let resp = await getQuestion()


            if (users.length === 2) {
                let collaboratorName = users.filter(name => name !== username)[0]
                setCollaboratorName(collaboratorName)
                setTitle(resp.data.question.title)
                setQuestion(resp.data.question.question)
                console.log("QUESTION IS", resp.data)


            }
        })

        collabSocket.on("collaborator_left", () => {
            handleFinish()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collabSocket])

    function pushUpdates(version, fullUpdates) {
        // Strip off transaction data
        let updates = fullUpdates.map(u => ({
            clientID: u.clientID,
            changes: u.changes.toJSON()
        }))
        return new Promise((resolve) => {
            collabSocket.emit('pushUpdates', { version, updates }, (response) => {
                resolve(
                    response
                )
            })
        })
    }

    function pullUpdates(version) {
        return new Promise((resolve) => {
            collabSocket.emit('pullUpdates', { version }, (response) => {
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
        return new Promise((resolve) => {
            collabSocket.emit('getDocument', (response) => {
                resolve({
                    version: response.version,
                    doc: Text.of(response.doc.split("\n"))
                })
            })
        })
    }

    async function getQuestion() {
        let difficulty = props.difficulty
        return axios.post(URL_QUESTION_SVC + "get", {
            difficulty
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

    function handleFinish() {
        collabSocket.disconnect()
        deleteCookie("room_name")
        props.handleExit()

        // For webcam service
        leaveCall();
    }

    function getDifficultyTag() {
        console.log(props.difficulty)
        if (props.difficulty === 'EASY') {
            return <Chip color="success" variant="filled" label="Easy" />
        } else if (props.difficulty === 'MEDIUM') {
            return <Chip color="warning" variant="filled" label="Medium" />
        } else {
            return <Chip color="error" variant="filled" label="Hard" />
        }
    }

    return (
        <Box display={"flex"} flexDirection={"column"} sx={{margin:"1rem"}}>
            <Box display={"flex"} gap="4px">
                <Box display={"flex"} flexDirection={"column"} flexGrow={1} minWidth={"300px"} maxWidth={"50%"}>
                <Box display={"flex"} flexDirection={"row"} alignItems="center" marginBottom="1rem">
                    <Typography marginRight="1rem" variant={"h6"}><strong>{title}</strong></Typography>
                    {getDifficultyTag()}
                </Box>
                        
                    <Typography variant={"h7"} marginBottom="1rem">{question}</Typography>
                    <Box width={"100%"} height={"100%"} sx={{ border: '1px solid', borderRadius:'3px' }}>
                        <Typography variant={"h6"} textAlign="center" marginBottom="4rem">You're matched with {collaboratorName}!</Typography>
                        <Typography variant={"h7"} textAlign="center">
                            Replace this with webcam stuff
                        </Typography>
                    </Box>
                </Box>
                <Editor peerExtension={peerExtension} initVersion={initVersion} initDoc={initDoc} />
            </Box>
            <Button variant={"contained"} color={"error"} onClick={handleFinish} sx={{marginTop:"1rem"}}>Finish</Button>
            <div 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}                
            >
                <VideoPlayer />
                <Options>
                    <Notifications />
                </Options>
            </div>

        </Box>
    )
}

export default QuestionPage;