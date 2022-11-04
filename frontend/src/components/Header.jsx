import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { getCookie, deleteCookie } from "../utils/cookies"
import { STATUS_CODE_CONFLICT, STATUS_CODE_OK } from "../constants";
import { userApi } from '../utils/api.js'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

const settings = ['Change Password', 'Delete User'];

const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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

    const handleCloseUserMenuAndRoute = (setting) => {
        setAnchorElUser(null);
        if (setting === 'Change Password') {
            navigate("/changepw")
        } else {
            setSuccessDialog('Are you sure you want to delete?')
        }
    };

    const handleCloseNavMenuAndHome = () => {
        setAnchorElNav(null);
        navigate("/home")
    };

    const toHome = () => navigate("/home")
    const toHistory = () => navigate("/history")
    const toLogin = () => navigate("/login")

    const handleLogout = async () => {
        const res = await userApi.post('/logout', {})
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    console.log(err)
                }
            })

        if (res.status === STATUS_CODE_OK) {
            deleteCookie("user")
            navigate("/login")
        }
    }


    if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/question") {
        return null
    }


    return (
        <div className="home">
            <AppBar position="static" sx={{ bgcolor: "#686868" }}>
                <Container maxWidth="false">
                    <Toolbar disableGutters>
                        <GroupIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            noWrap
                            sx={{
                                mr: 1,
                                display: { xs: 'none', md: 'flex' },
                            }}
                        >
                            PeerPrep
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >

                                <MenuItem key={'Home'} onClick={handleCloseNavMenuAndHome}>
                                    <Typography textAlign="center" textTransform='none'>{'Home'}</Typography>
                                </MenuItem>

                            </Menu>
                        </Box>
                        <GroupIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            noWrap
                            sx={{
                                mr: 4,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                            }}
                        >
                            PeerPrep
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                key={"home"}
                                onClick={toHome}
                                sx={{ ml: 1, my: 1, color: 'white', display: 'block', textTransform: 'none' }}
                            >
                                <Typography>
                                    {"Home"}
                                </Typography>
                            </Button>
                            <Button
                                key={"history"}
                                onClick={toHistory}
                                sx={{ ml: 1, my: 1, color: 'white', display: 'block', textTransform: 'none' }}
                            >
                                <Typography>
                                    {"History"}
                                </Typography>
                            </Button>
                            {/* insert new buttons here */}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Click to open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar sx={{ m: 1, marginRight: 3, bgcolor: 'secondary.main' }}>
                                        {/* <LockOutlinedIcon /> */}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Logout">

                                <IconButton onClick={() => handleLogout()} sx={{ m: 1, p: 0 }}>
                                    <LogoutIcon fontSize="large" color="action">
                                        {/* <LockOutlinedIcon /> */}
                                    </LogoutIcon>
                                </IconButton>
                            </Tooltip>

                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleCloseUserMenuAndRoute(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
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
                            ? <Button onClick={toLogin}>Done</Button>
                            : <><Button onClick={handleDelete}>Yes</Button>
                                <Button onClick={closeDialog}>No</Button></>
                        }

                    </DialogActions>
                </Dialog>}
        </div>

    );
};
export default Header;