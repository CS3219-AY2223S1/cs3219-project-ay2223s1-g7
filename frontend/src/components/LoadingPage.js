import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import { URL_USER_SVC, URL_MATCH_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { Timer } from "./Timer";


function LoadingPage(props) {

    return (
        <Box 
            display={"flex"} 
            flexDirection={"column"} 
            alignSelf={"center"} 
            width={"50%"} 
            sx={{ 'button': { m: 1 } }}>
            <Typography fontFamily={"Segoe UI"} variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Loading</Typography>
            <br></br>
            <Timer/>
            <br></br>
            <br></br>
            <Button variant={"contained"} color={"error"} onClick={() => props.handleExit()}>Exit</Button>
        </Box>
    )
}

export default LoadingPage;