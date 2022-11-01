import React, { useContext } from "react";
import { Button, Box } from "@mui/material";

import { SocketContext } from "../SocketContext";


const Notifications = () => {
    const { answerCall, callSignal, peerName, inCall, rejectCall } = useContext(SocketContext);

    return (
        callSignal !== null && !inCall ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my:'1rem' }}>
                <h4> {peerName} is calling: </h4>
                <Button size="small" variant="contained" sx={{ ml: '1rem' }} onClick={answerCall}>
                    Answer
                </Button>
                <Button size="small" variant="contained" sx={{ ml: '1rem' }} onClick={rejectCall}>
                    Reject
                </Button>
            </Box>
        ) : null

    )
}

export default Notifications