import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { STATUS_CODE_OK } from "../constants";
import { getCookie, deleteCookie } from "../utils/cookies.js"
import { userApi } from '../utils/api.js'

function SettingsPage() {
    const navigate = useNavigate();

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)


    const handleDelete = async () => {
        const username = getCookie("user")

        const res = await userApi.post('/delete', { username })
            .catch((err) => {
                setErrorDialog('Please try again later')
            })
        if (res && res.status === STATUS_CODE_OK) {

            deleteCookie("user")
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

            <Button className="settings-button" variant={"outlined"} onClick={handleDel}>Delete User</Button>
            <Button className="settings-button" variant={"outlined"} onClick={handleChangePw}>Change password</Button>

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
                </Dialog>}
        </div>
    )
}

export default SettingsPage;
