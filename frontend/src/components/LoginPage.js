import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    Link,
    Grid,
    Container,
    Alert,
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE_CONFLICT, STATUS_CODE_OK } from "../constants";
import Typist from 'react-typist-component';
import { setCookie } from '../utils/cookies.js'
import { userApi } from '../apis/api.js'

function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginSuccess, setIsLoginSuccess] = useState(false)
    const [hasSubmit, setHasSubmit] = useState(false);
    const [errMessage, setErrMessage] = useState("")

    const handleLogin = async () => {
        setHasSubmit(true);
        setIsLoginSuccess(false)
        const res = await userApi.post('/login', { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrMessage('The username and password you entered did not match our records.');
                } else {
                    setErrMessage("Please double-check and try again later.");
                }
            })

        console.log(res)
        if (res && res.status === STATUS_CODE_OK) {
            setCookie("user", username, 1)
            setIsLoginSuccess(true);
            // route to home
            navigate("/home")
        }
    }

    return (
        <Container component="main" maxWidth="xs" className="box-container">
            <Box
                sx={{
                    marginTop: 6,
                    marginBottom: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <GroupIcon color="secondary" sx={{ fontSize: 80, marginBottom: -2, overflow: 'hidden' }} />
                <Typography variant={"h4"} marginBottom={"0.3rem"}>PeerPrep</Typography>
                <Typist typingDelay={75}>
                    <Typography align="center" fontSize="15px" fontWeight="700" marginBottom={"0.1rem"}>
                        All-in-one collaborative platform to help you enhance your skills and prepare for technical interviews
                    </Typography>
                    <br />
                </Typist>
                {(hasSubmit && !isLoginSuccess && errMessage) && <Alert severity="error">{errMessage}</Alert>}
                <TextField
                    margin="normal"
                    label="Username"
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                    fullWidth
                    required
                />
                <TextField
                    margin="normal"
                    label="Password"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                    fullWidth
                >
                    Login
                </Button>
                <Grid container>
                    <Link href="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Box>
        </Container>
    )
}

export default LoginPage;
