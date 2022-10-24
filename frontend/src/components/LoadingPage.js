import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import { Timer } from "./Timer.js";


function LoadingPage(props) {

    return (
        <Box 
            display={"flex"} 
            flexDirection={"column"} 
            alignSelf={"center"} 
            width={"50%"}
            sx={{ 'button': { m: 1 }, padding: '1rem' }}>
            <Typography variant={"h4"} textAlign={"center"} marginBottom={"2rem"} marginTop={"2rem"}>
                Finding you a match...
            </Typography>
            <br></br>
            <Timer/>
            <br></br>
            <br></br>
            <Button variant={"contained"} color={"error"} onClick={() => props.handleExit()}>Exit</Button>
        </Box>
    )
}

export default LoadingPage;