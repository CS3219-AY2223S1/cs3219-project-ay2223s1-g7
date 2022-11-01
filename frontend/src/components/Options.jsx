import React, { useContext } from "react";
import { Button, Grid, Box, } from "@mui/material";
import { Phone, PhoneDisabled } from "@mui/icons-material";

import { SocketContext } from "../SocketContext";


export const Options = ({ children }) => {
    const { inCall, leaveCall, callUser, waitingCall } = useContext(SocketContext);

    return (
        <Box sx={{
            width: '100%',
            margin: '1rem 0',
        }}
        >
            <form sx={{ display: 'flex', flexDirection: 'row', width: '100%' }} noValidate autoComplete="off">
                <Grid sx={{ display: 'flex', flexDirection: 'column', mx:'1rem'}}>

                    <Grid sx={{ display: 'flex', flexDirection: 'row', }}>
                        {inCall ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PhoneDisabled fontSize="large" />}
                                fullWidth
                                onClick={leaveCall}
                            >
                                Hang Up
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Phone fontSize="large" />}
                                fullWidth
                                onClick={callUser}
                                disabled={waitingCall}
                            >
                                Call
                            </Button>
                        )}
                    </Grid>

                </Grid>
            </form>
            {children}

        </Box>

    )
}