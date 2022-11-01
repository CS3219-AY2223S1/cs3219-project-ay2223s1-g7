import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_OK} from "../constants";

function SettingsPage() {
    const navigate = useNavigate();

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)


    const handleDelete = async () => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const username = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        const res = await axios.post(URL_USER_SVC + '/delete', { token, username })
            .catch((err) => {
                setErrorDialog('Please try again later')
            })
        if (res && res.status === STATUS_CODE_OK) {

            document.cookie = "jwt_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            
            navigate("/login")
        }
    }
    
    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Confirmation')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const handleDel = () => {
        setSuccessDialog('Are you sure you want to delete?')
    }

    const handleChangePw = () => {
        navigate('/changepw')
    }

    return (
        <div className="home">
          
          <Button  className="settings-button" variant={"outlined"} onClick={handleDel}>Delete User</Button>
          <Button  className="settings-button" variant={"outlined"} onClick={handleChangePw}>Change password</Button>
            
            {
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>

                {isDeleteSuccess
                        ? <Button onClick={navigate("/login")}>Done</Button>
                        : <><Button onClick={handleDelete}>Yes</Button>
                        <Button onClick={closeDialog}>No</Button></>
                    }
                    
                </DialogActions>
            </Dialog> }
        </div>
    )
}

export default SettingsPage;
