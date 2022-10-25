import React from "react";
import { Grid, Typography, Paper, Box, Button } from "@mui/material";
import { useContext } from "react";
import { SocketContext } from "../SocketContext";
import { Mic, MicOff, VideoCall, Videocam, VideocamOff } from "@mui/icons-material";

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, toggleVideo, videoSetting, toggleAudio, audioSetting, videoInitialized } = useContext(SocketContext);
    // const classes = 
    return (
        <Grid container sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row'
        }}>
            <Paper sx={{
                padding: '10px',
                border: '2px solid black',
                margin: '10px',
            }}
            >
                <Grid >
                    <Typography variant="h5" gutterBottom> {name || 'Name'} </Typography>
                    <video sx={{ width: '50%' }} playsInline muted ref={myVideo} autoPlay />
                </Grid>

                {!videoInitialized && (
                    <Button variant="contained" color="primary"
                        onClick={toggleVideo}
                        startIcon={<VideoCall/>}>
                    </Button>
                )}

                {videoInitialized && (
                    <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", }}>

                        <Button variant="contained" color="primary"
                            onClick={toggleVideo}
                            startIcon={videoSetting ? <Videocam /> : <VideocamOff />}>
                        </Button>
                        <Button variant="contained" color="primary"
                            onClick={toggleAudio}
                            startIcon={audioSetting ? <Mic /> : <MicOff />}>
                        </Button>
                    </Box>

                )}



            </Paper>

            {callAccepted && !callEnded && (
                <Paper sx={{
                    padding: '10px',
                    border: '2px solid black',
                    margin: '10px',
                }}
                >
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom> {call.name || 'Name'} </Typography>
                        <video sx={{ width: '50%' }} playsInline muted ref={userVideo} autoPlay />
                    </Grid>
                </Paper>
            )}

        </Grid>

    )
}

export default VideoPlayer