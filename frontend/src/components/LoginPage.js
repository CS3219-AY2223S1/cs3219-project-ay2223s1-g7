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
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_OK } from "../constants";

function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginSuccess, setIsLoginSuccess] = useState(false)
    const [hasSubmit, setHasSubmit] = useState(false);
    const [errMessage, setErrMessage] = useState("")

    const handleLogin = async () => {
        setHasSubmit(true);
        setIsLoginSuccess(false)
        const res = await axios.post(URL_USER_SVC + '/login', { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrMessage('The username and password you entered did not match our records.');
                } else {
                    setErrMessage("Please double-check and try again later.");
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            createCookieInHour(res.data.token, username);
            setIsLoginSuccess(true);
            // route to home
            window.location.href = "http://localhost:3000/home";
        }
    }

    const createCookieInHour = (cookieValue, username) => {
        let date = new Date();
        date.setTime(date.getTime() + (60 * 60 * 1000));
        document.cookie = "jwt_token=" + cookieValue + ";expires=" + date.toGMTString();
        document.cookie = "user=" + username + ";expires=" + date.toGMTString();
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    {/* <LockOutlinedIcon /> */}
                </Avatar>
                <Typography component={"h1"} variant={"h3"} marginBottom={"1rem"}>Login</Typography>
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
                    Submit
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
