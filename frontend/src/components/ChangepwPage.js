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
import { STATUS_CODE_OK } from "../constants";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie } from '../utils/cookies.js'
import { userApi } from '../utils/api.js'


function ChangepwPage() {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isChangeSuccess, setIsChangeSuccess] = useState(false)

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setIsChangeSuccess(false)
        const username = getCookie("user")

        const res = await userApi.post('/changepw', { username, oldPassword, newPassword })
            .catch((err) => {
                setErrorDialog('Please check your old/new password and try again')
            })
        console.log(res)
        if (res && res.status === STATUS_CODE_OK) {
            deleteCookie("user")
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
                <form onSubmit={handleChangePassword}>
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
                        fullWidth
                    >
                        Confirm
                    </Button>
                </form>

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