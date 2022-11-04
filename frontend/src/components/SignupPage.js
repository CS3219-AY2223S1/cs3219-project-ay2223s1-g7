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
import { useState } from "react";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { useNavigate } from "react-router-dom";
import { userApi } from '../apis/api.js'

function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [hasSubmit, setHasSubmit] = useState(false);
    const [errMessage, setErrMessage] = useState("")
    const [succMessage, setSuccessMsg] = useState("")

    const handleSignup = async () => {
        setHasSubmit(true);
        setIsSignupSuccess(false)
        const res = await userApi.post('', { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrMessage('This username already exists. Please try again with another username')
                } else {
                    setErrMessage('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessMsg('Congratulations! Your account has been successfully created')
            setIsSignupSuccess(true)
            setTimeout(toLogin, 2000);
        }
    }
    const toLogin = () => navigate("/login")


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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    {/* <LockOutlinedIcon /> */}
                </Avatar>
                <Typography variant={"h4"} marginBottom={"1rem"}>Sign Up</Typography>
                {(hasSubmit && !isSignupSuccess && errMessage) && <Alert severity="error">{errMessage}</Alert>}
                {(hasSubmit && isSignupSuccess && succMessage) && <Alert severity="success">{succMessage}</Alert>}
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
                    onClick={handleSignup}
                    fullWidth
                >
                    Sign up
                </Button>
                <Grid container>
                    <Link href="/login" variant="body2">
                        {"Already have an account? Login"}
                    </Link>
                </Grid>
            </Box>
        </Container>
    )
}

export default SignupPage;
