import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"

import { getCookie, setCookie } from "../utils/cookies"
import QuestionSelectionPage from "./QuestionSelectionPage";
import LoadingPage from "./LoadingPage";
import QuestionPage from "./QuestionPage";
import HistoryPage from "./HistoryPage"
import { MATCH_SOCKET_PATH, URL_MATCH_SVC } from "../configs";
import { authenticate } from '../utils/authentication.js'

function HomePage() {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState("")
    const [matchSocket, setMatchSocket] = useState(io())
    const [route, setRoute] = useState("/home")

    useEffect(() => {
        navigate(route)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // maybe add navigation to this listener instead
        matchSocket.on('connection')

        matchSocket.on('matchFail', () => {
            console.log("match failed")
            matchSocket.disconnect()
            setRoute("/home")
            navigate("/home")
        })

        matchSocket.on('matchSuccess', async (roomName) => {
            console.log("match Success")
            setCookie("room_name", roomName, 5)
            setRoute("/question")
            let isAuth = await authenticate()
            if (!isAuth) window.location.reload();
            navigate("/question")
            matchSocket.disconnect()
        })
    }, [navigate, matchSocket])

    const handleMatching = async (difficulty) => {
        setDifficulty(difficulty)
        let username = getCookie("user")
        setMatchSocket(io(URL_MATCH_SVC, {
            path: MATCH_SOCKET_PATH,
            query: {
                "username": username,
                "difficulty": difficulty
            },
            closeOnBeforeunload: false
        }))
        let isAuth = await authenticate()
        if (!isAuth) window.location.reload();
        setRoute("/loading")
        navigate("/loading")
    }

    const handleExitToHome = async () => {
        matchSocket.disconnect()
        // let isAuth = await authenticate()
        // if (!isAuth) window.location.reload();
        // setRoute("/home")
        // navigate("/home")
        
        // reloading the page will automatically do authentication
        // and navigate to the home page
        window.location.reload();
    }

    return (
        (route === "/home" || route === "/")
            ? <QuestionSelectionPage handleMatching={handleMatching} />
            : (route === "/loading"
                ? <LoadingPage
                    handleExit={handleExitToHome}
                    difficulty={difficulty}
                />
                : (route === "/history" ?
                    <HistoryPage /> : <QuestionPage
                        handleExit={handleExitToHome}
                        difficulty={difficulty} />)
            )
    )
}

export default HomePage;