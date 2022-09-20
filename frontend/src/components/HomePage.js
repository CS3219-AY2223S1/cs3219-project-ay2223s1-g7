import React, { useEffect, useState } from "react";
import { URL_USER_SVC, URL_MATCH_SVC } from "../configs";
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
    const [socket, setSocket] = useState(io())
    const [text, setText] = useState("")
    const [route, setRoute] = useState(useLocation().pathname)


    // Adds prompt before exiting/refreshing the page
    // Exiting/refreshing the page will disconnect socket
    // window.onbeforeunload = (event) => {
    //     const e = event || window.event;
    //     e.preventDefault();
    //     if (e) {
    //         e.returnValue = ''; // Legacy method for cross browser support
    //     }
    //     return ''; // Legacy method for cross browser support
    // };

    useEffect(() => {
        socket.on('connection')

        socket.on('matchFail', () => {
            console.log("match failed")
            socket.disconnect()
            setRoute("/home")
            navigate("/home")
        })

        socket.on('matchSuccess', (roomName) => {
            console.log("match Success")
            // room name cookie not in use for now
            setCookie("room_name", roomName, 5)
            setRoute("/question")
            navigate("/question")
        })

        socket.on("received_message", (data) => {
            setText(data)
        })
    }, [navigate, socket])

    const handleMatching = async (difficulty) => {
        console.log(difficulty)
        setDifficulty(difficulty)
        let username = getCookie("user")
        setSocket(io(URL_MATCH_SVC, {
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
        socket.emit('send_message', value)
        setText(value)
    }

    const handleExitToHome = async () => {
        setText("")
        socket.disconnect()
        setRoute("/home")
        navigate("/home")
    }

    return (
        route === "/home"
            ? <QuestionSelectionPage handleMatching={handleMatching} handleTextChange={handleTextChange} />
            : (route === "/loading"
                ? <LoadingPage handleExit={handleExitToHome} />
                : <QuestionPage text={text} handleExit={handleExitToHome} handleTextChange={handleTextChange} />
            )
    )
}

export default HomePage;