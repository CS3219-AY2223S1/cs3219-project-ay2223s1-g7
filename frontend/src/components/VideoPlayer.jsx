import React from "react";
import {Grid, Typography, Paper} from "@mui/material";
import { useContext } from "react";
import { SocketContext } from "../SocketContext";
export const VideoPlayer = () => {
    const {name, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext);
    // const classes = 
    return (
        <Grid container> 
            <Paper>
                <Grid item xs={12} md={6}> 
                <Typography variant="h5" gutterBottom> {name || 'Name'} </Typography>
                        <video playsInline muted ref={myVideo} autoPlay />
                </Grid>
            </Paper>
            
            <Paper>
                <Grid item xs={12} md={6}> 
                <Typography variant="h5" gutterBottom> {call.name || 'Name'} </Typography>
                        <video playsInline ref={userVideo} autoPlay />
                </Grid>
            </Paper>
        </Grid>

    )
}

export default VideoPlayer