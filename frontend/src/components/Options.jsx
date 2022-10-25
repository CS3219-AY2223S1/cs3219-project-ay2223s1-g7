import React, {useContext} from "react";
import {Button, TextField, Grid, Typography, Container, Paper,} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled} from "@mui/icons-material";
import { getCookie } from "../utils/cookies"


import { SocketContext } from "../SocketContext";
import { useState, useEffect} from "react";


export const Options = ({children}) => {
    const {me, callAccepted, callEnded, name, setName, leaveCall, callUser} = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    
    useEffect(() => {
        setName(getCookie("user"))
    }, [])


    return (
        <Container sx={{
                width: '600px',
                margin: '35px 0',
                padding: 0,
                
        }}
        >
                <form sx={{display: 'flex', flexDirection: 'row',}} noValidate autoComplete="off">
                    <Grid sx={{display: 'flex', flexDirection: 'column',}}>
                            {/* <Typography gutterBottom variant="h6"> Account Info</Typography> */}
                            {/* <TextField label="Name" value={getCookie("user")} onChange={(e) => setName(e.target.value)} fullWidth/> */}
                             
                        <CopyToClipboard text={me}>
                            <Button variant="contained" color="primary" fullWidth 
                            startIcon={<Assignment fontSize="large" />}>
                                Copy Id
                            </Button>
                        </CopyToClipboard>


                        <Grid sx={{display: 'flex', flexDirection: 'row',}}>
                            <TextField label="ID to Call" value={idToCall} 
                            onChange={(e) => setIdToCall(e.target.value)} fullWidth>
                            </TextField>
                            {callAccepted && !callEnded? (
                                <Button 
                                variant="contained" 
                                color="secondary" 
                                startIcon={<PhoneDisabled fontSize="large" />}
                                fullWidth
                                onClick={leaveCall}
                                // sx={{ marginTop: 20}}
                                >
                                 Hang Up
                                </Button>
                            ) : (
                                <Button
                                variant="contained" 
                                color="secondary" 
                                startIcon={<Phone fontSize="large" />}
                                fullWidth
                                onClick={() => callUser(idToCall)}
                                // sx={{ marginTop: 20}}
                                >
                                Call
                                </Button>
                            )}
                        </Grid>

                    </Grid>
                </form>
                {children}

        </Container>

    )
}