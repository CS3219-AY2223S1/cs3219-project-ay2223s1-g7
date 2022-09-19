import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_MATCH_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client"
import { getCookie, setCookie } from "../utils/cookies"

// const socket = io(URL_MATCH_SVC)

function QuestionSelectionPage() {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState("")
    const [socket, setSocket] = useState(io())
    const [text, setText] = useState("")

    // useEffect(() => {
    //     window.addEventListener("beforeunload", alertUser);
    //     return () => {
    //         window.removeEventListener("beforeunload", alertUser);
    //     };
    // }, []);
    // const alertUser = (e) => {
    //     e.preventDefault();
    //     e.returnValue = "";
    // };
    window.onbeforeunload = (event) => {
        const e = event || window.event;
        // Cancel the event
        e.preventDefault();
        if (e) {
            e.returnValue = ''; // Legacy method for cross browser support
        }
        return ''; // Legacy method for cross browser support
    };
    useEffect(() => {
        socket.on('connection')

        socket.on('matchFail', () => {
            // handle match fail
            console.log("match failed")
        })

        socket.on('matchSuccess', (roomName) => {
            // handle match success
            console.log("match Success")
            setCookie("room_name", roomName, 5)
        })

        socket.on("received_message", (data) => {
            setText(data)
        })
    }, [socket])

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

        navigate("/loading")
    }

    const handleTextChange = (event) => {
        var value = event.target.value
        socket.emit('send_message', value)
        setText(value)
    }

    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Choose difficulty</Typography>
            <Button variant={"contained"} color={"success"} onClick={() => handleMatching("EASY")}>EASY</Button>
            <Button variant={"contained"} color={"warning"} onClick={() => handleMatching("MEDIUM")}>MEDIUM</Button>
            <Button variant={"contained"} color={"error"} onClick={() => handleMatching("HARD")}>HARD</Button>
            <TextField multiline rows={7} onChange={handleTextChange} value={text} />
        </Box>
    )
}

export default QuestionSelectionPage;