import {
    List,ListItem, IconButton,CommentIcon,ListItemText, Container
} from "@mui/material";
import React, { useEffect, useState, } from "react";
import axios from "axios";

import { getCookie } from "../utils/cookies"
import {  URL_QUESTION_SVC } from "../configs";

function HistoryPage(props) {
    const [history, setHistory] = useState([])
    
    useEffect(() => {

        const fetchData = async ()=> {
            const data = await axios.post(URL_QUESTION_SVC + "attempts", {
                user: getCookie("user")
            })
            console.log("Fetching data")

            setHistory(data.data.question)
        
        }
        fetchData().catch(console.error)
        
    }, [])


    return (
        <Container component="main" maxWidth="xs" className="box-container">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {history.map((attempt) => (
                    <ListItem>
                        <ListItemText primary={`${attempt.title}`}/>
                        <ListItemText primary={`${attempt.difficulty}`}/>
                    </ListItem>
                ))}
            </List>

        </Container>

        
       
    )
}

export default HistoryPage;