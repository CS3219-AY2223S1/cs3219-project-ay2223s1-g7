import React, { useEffect, useState } from "react";
import { URL_USER_SVC, URL_MATCH_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client"
import { getCookie, setCookie } from "../utils/cookies"
import QuestionSelectionPage from "./QuestionSelectionPage";
import LoadingPage from "./LoadingPage";
import QuestionPage from "./QuestionPage";


function HomePage(props) {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState("")
    const [matchSocket, setMatchSocket] = useState(io())
    const [text, setText] = useState("")
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
            setCookie("room_name", roomName, 5)
            setRoute("/question")
            navigate("/question")
            matchSocket.disconnect()
        })
    }, [navigate, matchSocket])

    const handleMatching = (difficulty) => {
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

    const handleExitToHome = () => {
        setText("")
        matchSocket.disconnect()
        setRoute("/home")
        navigate("/home")
    }

    return (
        (route === "/home" || route === "/")
            ? <QuestionSelectionPage handleMatching={handleMatching} />
            : (route === "/loading"
                ? <LoadingPage handleExit={handleExitToHome} />
                : <QuestionPage
                    text={text}
                    handleExit={handleExitToHome} />
            )
    )
}

export default HomePage;