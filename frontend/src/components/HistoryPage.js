import {
    List, ListItem, ListSubheader, IconButton, CommentIcon, ListItemText, Container,
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
    TablePagination, Box, Collapse, Typography, Tooltip, Rating
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useEffect, useState, } from "react";
import axios from "axios";

import { getCookie } from "../utils/cookies"
import { URL_QUESTION_SVC } from "../configs";

const header = [
    {id: 'dropdown', name: 'Action'},
    {id: 'title', name: 'Title'}, 
    {id: 'difficulty', name: 'Difficulty'},
    
]

function HistoryPage(props) {
    const [history, setHistory] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {

        const fetchData = async () => {
            const data = await axios.post(URL_QUESTION_SVC + "attempts", {
                user: getCookie("user")
            })
            console.log("Fetching data")
            setHistory(data.data.question)
            console.log(data.data.question)

        }
        fetchData().catch(console.error)

    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };
    
    return (
        
        <Box flexDirection={"column"} display={"flex"} alignItems={"center"} justifyContent={"center"} height="calc(100vh - 64px)" width="100%" minHeight={"100px"}>
        <h1>List of attempted Questions</h1>
            <Paper sx={{ width: '50%', overflow: 'hidden', minWidth: 480 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {header.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{fontSize: '20px', backgroundColor: '#d6cccc'}}
                                    //   align={column.align}
                                    //   style={{ minWidth: column.minWidth }}
                                    >
                                        {column.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((attempt) => {
                                    return <MyRow attempt={attempt} header={header} key={attempt.title} />
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={history.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    
    )
}


function MyRow({ attempt, header }) {
    const [open, setOpen] = useState(false);
    var level= ""
    attempt.dropdown = (
        <Tooltip title="Show question">
        <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
        >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        </Tooltip>
    )

    function getDifficultyTag() {
        if (level === 'EASY') {
            return <span><Rating size="small" value={1} max={3} readOnly /></span>
        } else if (level === 'MEDIUM') {
            return <span><Rating size="small" value={2} max={3} readOnly /></span>
        } else if (level === 'HARD') {
            return <span><Rating size="small" value={3} max={3} readOnly /></span>
        } else {
            return <span></span>
        }
    }

    return (
        <>
            <TableRow hover role="checkbox" tabIndex={-1} key={attempt.title}>
                {header.map((column) => {
                    const value = attempt[column.id];
                    if (column.id === 'difficulty') {
                        level = value
                    } else {
                        level = ""
                    }
                    return (
                        <TableCell style={{fontSize: '17px'}} key={column.name} >
                            {value} {getDifficultyTag()}
                        </TableCell>
                    );
                })}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: "2rem" }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {attempt.question}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default HistoryPage;