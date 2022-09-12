import {
    Box,
    Button,
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogContentText,
    // DialogTitle,
    // TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_OK} from "../constants";
import {Link, useNavigate} from "react-router-dom";

function QuestionSelectionPage() {
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    // const [isDialogOpen, setIsDialogOpen] = useState(false)
    // const [dialogTitle, setDialogTitle] = useState("")
    // const [dialogMsg, setDialogMsg] = useState("")
    // const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [difficulty, setDifficulty] = useState("")
    const navigate = useNavigate();

    const handleMatching = async (difficulty) => {
        console.log(difficulty)
        setDifficulty(difficulty)
        // setIsSignupSuccess(false)
        // const res = await axios.post(URL_USER_SVC, { username, password })
        //     .catch((err) => {
        //         if (err.response.status === STATUS_CODE_CONFLICT) {
        //             setErrorDialog('This username already exists')
        //         } else {
        //             setErrorDialog('Please try again later')
        //         }
        //     })
        // if (res && res.status === STATUS_CODE_CREATED) {
        //     setSuccessDialog('Account successfully created')
        //     setIsSignupSuccess(true)
        // }
    }


    const handleLogout = async () => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(token){
            const res = await axios.post(URL_USER_SVC + '/logout', {token})
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    console.log(err)
                }
                else {
                }
            })

            if (res.status === STATUS_CODE_OK) {
                navigate("/login")
            }
        }
    }

    // const closeDialog = () => setIsDialogOpen(false)

    // const setSuccessDialog = (msg) => {
    //     setIsDialogOpen(true)
    //     setDialogTitle('Success')
    //     setDialogMsg(msg)
    // }

    // const setErrorDialog = (msg) => {
    //     setIsDialogOpen(true)
    //     setDialogTitle('Error')
    //     setDialogMsg(msg)
    // }

    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"100%"}>

            <Box alignSelf={"center"} width={"100%"} sx={{ 'button': { m: 1 } }}>
                <Button variant={"contained"} color={"error"} style={{float: 'right'}}
                onClick={() => handleLogout()} >Logout</Button>
            </Box>


            <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
                <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Choose difficulty</Typography>
                <Button variant={"contained"} color={"success"} onClick={() => handleMatching("EASY")}>EASY</Button>
                <Button variant={"contained"} color={"warning"} onClick={() => handleMatching("MEDIUM")}>MEDIUM</Button>
                <Button variant={"contained"} color={"error"} onClick={() => handleMatching("HARD")}>HARD</Button>
            </Box>
        </Box>

    )
}

export default QuestionSelectionPage;
