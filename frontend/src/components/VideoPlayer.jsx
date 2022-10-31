import React, { useEffect, useContext, useState } from "react";
import { Grid, Typography, Paper, Box, Button, Tooltip } from "@mui/material";
import { Mic, MicOff, VideoCall, Videocam, VideocamOff } from "@mui/icons-material";
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import { io } from 'socket.io-client'

import { SocketContext } from "../SocketContext";
import { URL_WEBCAM_SVC } from '../configs.js'
import { getCookie } from "../utils/cookies.js";




const VideoPlayer = () => {
    const { inCall, myVideo, peerVideo, peerName, stream, toggleVideo, initiateWebcam, videoOn, toggleAudio, audioOn, setSocket, updateWebcam, updateAudio, webcamList, audioList } = useContext(SocketContext);
    const [currentWebcam, setcurrentWebcam] = useState('');
    const [currentAudio, setcurrentAudio] = useState('');

    useEffect(() => {
        let roomName = getCookie("room_name")
        let username = getCookie("user")
        setSocket(io(URL_WEBCAM_SVC, {
            query: {
                "username": username,
                "roomName": roomName
            },
            closeOnBeforeunload: false
        }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getResolution = () => {
        let myVideo = document.getElementById("myVideo");
        if (myVideo)
            console.log("myVideo height and width", myVideo.videoHeight, myVideo.videoWidth)
        let peerVideo = document.getElementById("peerVideo");
        if (peerVideo)
            console.log("peerVideo height and width", peerVideo.videoHeight, peerVideo.videoWidth)
    }



    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
            <Paper sx={{
                flex: "1 1 1",
                padding: '10px',
                border: '2px solid black',
                margin: '10px',
                minWidth: '240px',
            }}>
                <Box sx={{}}>
                    <Typography variant="h5" gutterBottom> You </Typography>
                    <video id="myVideo" style={{ width: '100%', maxHeight: 'min(30vh, 18vw)', minHeight: '200px', }} playsInline muted ref={myVideo} autoPlay onClick={getResolution} />
                    {stream ? (
                        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", }}>
                            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "flex-start", maxWidth:'75%'}}>

                                <Tooltip title={videoOn ? "Turn off video" : "Turn on video"}>
                                    <Button variant="contained" color="primary"
                                        onClick={toggleVideo}
                                        startIcon={videoOn ? <VideocamOff /> : <Videocam />}>
                                    </Button>
                                </Tooltip>


                                <TextField
                                    value={currentWebcam}
                                    onChange={(event) => { updateWebcam(event.target.value); setcurrentWebcam(event.target.value) }}
                                    select
                                >
                                    {webcamList.map(x => <MenuItem key={x.key} value={x.value}>{x.key}</MenuItem>)}
                                </TextField>

                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "flex-start", maxWidth:'75%'}}>

                                <Tooltip title={audioOn ? "Turn off audio" : "Turn on audio"}>
                                    <Button variant="contained" color="primary"
                                        onClick={toggleAudio}
                                        startIcon={audioOn ? <MicOff /> : <Mic />}>
                                    </Button>
                                </Tooltip>

                                <TextField
                                    value={currentAudio}
                                    onChange={(event) => { updateAudio(event.target.value); setcurrentAudio(event.target.value) }}
                                    select
                                >
                                    {audioList.map(x => <MenuItem key={x.key} value={x.value}>{x.key}</MenuItem>)}
                                </TextField>
                            </Box>

                        </Box>
                    ) : (
                        <Tooltip title="Turn on webcam and audio">
                            <Button variant="contained" color="primary"
                                onClick={initiateWebcam}
                                startIcon={<VideoCall />}>
                            </Button>
                        </Tooltip>
                    )}
                </Box>


            </Paper>


            {inCall ? (
                <Paper sx={{
                    flex: "1 1 1",
                    padding: '10px',
                    border: '2px solid black',
                    margin: '10px',
                    minWidth: '240px',
                }}
                >
                    <Box>
                        <Typography variant="h5" gutterBottom>{peerName}</Typography>
                        <video id="peerVideo" style={{ width: '100%', maxHeight: 'min(30vh, 18vw)', minHeight: '200px', }} playsInline ref={peerVideo} autoPlay onClick={getResolution} />
                    </Box>
                </Paper>

            ) : null}

        </Box>

    )
}

export default VideoPlayer