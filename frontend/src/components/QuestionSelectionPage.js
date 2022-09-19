import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {URL_USER_SVC, URL_MATCH_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_OK} from "../constants";
import {Link, useNavigate} from "react-router-dom";
import { io } from "socket.io-client"

// const socket = io(URL_MATCH_SVC)

function QuestionSelectionPage() {
    const [difficulty, setDifficulty] = useState("")
    const [socket, setSocket] = useState(io())
    const [text, setText] = useState("")
    const navigate = useNavigate();

    useEffect(() => {

        socket.on('connection')

        socket.on("received_message", (data) => {
            setText(data)
        })
    }, [socket])
    
    const handleMatching = async (difficulty) => {
        console.log(difficulty)
        setDifficulty(difficulty)
        var username = "something"
        setSocket(io(URL_MATCH_SVC, {
            query: {
                "username": username,
                "difficulty": difficulty
            }
        }))
    }

    const handleTextChange = (event) => {
        var value = event.target.value
        socket.emit('send_message', value)
        setText(value)
    }


    const handleLogout = async () => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(token){
            const res = await axios.post(URL_USER_SVC + '/logout', {token})
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    console.log(err)
                }
                else {
                }
            })

            if (res.status === STATUS_CODE_OK) {
                console.log("LOGOUT SUCCESS")
                navigate("/login")
            }
        }
    }

    return (


        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"100%"}>

        <Box alignSelf={"center"} width={"100%"} sx={{ 'button': { m: 1 } }}>
            <Button variant={"contained"} color={"error"} style={{float: 'right'}}
            onClick={() => handleLogout()} >Logout</Button>
        </Box>

        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Choose difficulty</Typography>
            <Button variant={"contained"} color={"success"} onClick={() => handleMatching("EASY")}>EASY</Button>
            <Button variant={"contained"} color={"warning"} onClick={() => handleMatching("MEDIUM")}>MEDIUM</Button>
            <Button variant={"contained"} color={"error"} onClick={() => handleMatching("HARD")}>HARD</Button>
            <TextField multiline rows={7} onChange={handleTextChange} value={text}/>
        </Box>

        </Box>

    )
}

export default QuestionSelectionPage;