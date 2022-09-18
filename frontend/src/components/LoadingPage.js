import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {URL_USER_SVC, URL_MATCH_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED} from "../constants";
import {Link, useNavigate} from "react-router-dom";
import { io } from "socket.io-client"


// const socket = io(URL_MATCH_SVC)

function LoadingPage() {
    const navigate = useNavigate()
    const [socket, setSocket] = useState(io())
    const [text, setText] = useState("")

    useEffect(() => {
        socket.on('connection')
        socket.on("received_message", (data) => {
            setText(data)
        })
    }, [socket])

    const handleExit = async () => {
        /* setSocket(io(URL_MATCH_SVC, {
            query: {
                "username": username,
                "difficulty": difficulty
            }
        }))
        */
        navigate("/home")
    }


    
    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Loading</Typography>
            <Button variant={"contained"} color={"error"} onClick={() => handleExit()}>Exit</Button>
        </Box>
    )
}

export default LoadingPage;