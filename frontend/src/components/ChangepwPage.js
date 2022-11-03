import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    Avatar,
    Container,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_CREATED } from "../constants";
import { useNavigate } from "react-router-dom";


function ChangepwPage() {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isChangeSuccess, setIsChangeSuccess] = useState(false)

    const handleChangePassword = async () => {
        setIsChangeSuccess(false)
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const username = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        const res = await axios.post(URL_USER_SVC + '/changepw', { username, oldPassword, newPassword, token })
            .catch((err) => {
                setErrorDialog('Please check your old/new password and try again')
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            document.cookie = "jwt_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            setSuccessDialog('Password successfully changed, please log in again')
            setIsChangeSuccess(true)
            setTimeout(toLogin, 2000);
        }
    }

    const toLogin = () => navigate("/login")

    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    return (
        <Container component="main" maxWidth="xs" className="box-container">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    {/* <LockOutlinedIcon /> */}
                </Avatar>
                <Typography variant={"h4"} marginBottom={"1rem"}>Change Password</Typography>
                <TextField
                    margin="normal"
                    label="Old Password"
                    variant="standard"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    sx={{ marginBottom: "1rem" }}
                    autoFocus
                    fullWidth
                    required
                />

                <TextField
                    margin="normal"
                    label="New Password"
                    variant="standard"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ marginBottom: "2rem" }}
                    fullWidth
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleChangePassword}
                    fullWidth
                >
                    Confirm
                </Button>

                <Dialog
                    open={isDialogOpen}
                    onClose={closeDialog}
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{dialogMsg}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {isChangeSuccess
                            ? <></>
                            : <Button onClick={closeDialog}>Done</Button>
                        }
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    )
}

export default ChangepwPage;