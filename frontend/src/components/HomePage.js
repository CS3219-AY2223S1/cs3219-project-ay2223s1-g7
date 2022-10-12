import React, { useEffect, useState } from "react";
import { URL_USER_SVC, URL_MATCH_SVC, URL_COLLAB_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client"
import { getCookie, setCookie } from "../utils/cookies"
import QuestionSelectionPage from "./QuestionSelectionPage";
import LoadingPage from "./LoadingPage";
import QuestionPage from "./QuestionPage";


function HomePage(props) {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState("")
    const [matchSocket, setMatchSocket] = useState(io())
    const [collabSocket, setCollabSocket] = useState(io())
    const [text, setText] = useState("")
    const [collaboratorName, setCollaboratorName] = useState("")
    const [collaboratorTextPos, setCollaboratorTextPos] = useState(0)
    const [route, setRoute] = useState(useLocation().pathname)

    useEffect(() => {
        // maybe add navigation to this listener instead
        matchSocket.on('connection')

        matchSocket.on('matchFail', () => {
            console.log("match failed")
            matchSocket.disconnect()
            setRoute("/home")
            navigate("/home")
        })

        matchSocket.on('matchSuccess', (roomName) => {
            console.log("match Success")
            // room name cookie not in use for now
            setCookie("room_name", roomName, 5)
            setRoute("/question")
            navigate("/question")
            matchSocket.disconnect()
            let username = getCookie("user")
            setCollabSocket(io(URL_COLLAB_SVC, {
                query: {
                    "username": username,
                    "roomName": roomName
                },
                closeOnBeforeunload: false
            }))
        })

        matchSocket.on("received_message", (data) => {
            setText(data)
        })
    }, [navigate, matchSocket])


    useEffect(() => {
        collabSocket.on("joinRoomSuccess", (data) => {
            let users = data.users
            console.log(users)
            let username = getCookie("user")
            if (users.length === 2) {
                let collaboratorName = users.filter(name => name !== username)[0]
                console.log(collaboratorName)
                setCollaboratorName(collaboratorName)
            }
            // get collaborator from users
            // set collaborator
        })

        collabSocket.on("collaborator_left", () => {
            console.log("collaborator left")
            setCollaboratorName("")
        })

        collabSocket.on("received_message", (data) => {
            setText(data)
        })
    }, [collabSocket])

    const handleMatching = async (difficulty) => {
        console.log(difficulty)
        setDifficulty(difficulty)
        let username = getCookie("user")
        setMatchSocket(io(URL_MATCH_SVC, {
            query: {
                "username": username,
                "difficulty": difficulty
            },
            closeOnBeforeunload: false
        }))
        setRoute("/loading")
        navigate("/loading")
    }

    const handleTextChange = (event) => {
        var value = event.target.value
        // check if collaborator exists, dont need to send if alone in room
        collabSocket.emit('send_message', value)
        setText(value)
    }

    const handleExitToHome = async () => {
        setText("")
        matchSocket.disconnect()
        collabSocket.disconnect()
        setRoute("/home")
        navigate("/home")
    }

    return (
        route === "/home"
            ? <QuestionSelectionPage handleMatching={handleMatching} handleTextChange={handleTextChange} />
            : (route === "/loading"
                ? <LoadingPage handleExit={handleExitToHome} />
                : <QuestionPage text={text} handleExit={handleExitToHome} handleTextChange={handleTextChange} collaboratorName={collaboratorName}/>
            )
    )
}

export default HomePage;