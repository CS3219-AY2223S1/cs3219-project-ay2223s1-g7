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
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Matching...</Typography>
            <Timer/>
            <Button variant={"contained"} color={"error"} onClick={() => props.handleExit()}>Exit</Button>
        </Box>
    )
}

export default LoadingPage;