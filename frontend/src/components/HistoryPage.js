import {
    List, ListItem, ListSubheader, IconButton, CommentIcon, ListItemText, Container,
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Box,
} from "@mui/material";
import React, { useEffect, useState, } from "react";
import axios from "axios";

import { getCookie } from "../utils/cookies"
import { URL_QUESTION_SVC } from "../configs";

const header = ['Title', 'Difficulty']

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
        // <Container component="main" maxWidth="xs" className="box-container">
        //     <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        //         <ListSubheader>
        //             <ListItemText primary={`title`} />
        //             <ListItemText primary={`difficulty`} />
        //         </ListSubheader>
        //         {history.map((attempt) => (
        //             <ListItem key={attempt.title}>
        //                 <ListItemText primary={`${attempt.title}`} />
        //                 <ListItemText primary={`${attempt.difficulty}`} />
        //             </ListItem>
        //         ))}
        //     </List>

        // </Container>
        <Box flexDirection={"column"} display={"flex"} alignItems={"center"} justifyContent={"center"} height="calc(100vh - 64px)" width="100%" minHeight={"800px"}>

            <Paper sx={{ width: '50%', overflow: 'hidden', minWidth: 480 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {header.map((column) => (
                                    <TableCell
                                        key={column}
                                    //   align={column.align}
                                    //   style={{ minWidth: column.minWidth }}
                                    >
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((attempt) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={attempt.title}>
                                            {header.map((column) => {
                                                const value = attempt[column.toLowerCase()];
                                                return (
                                                    <TableCell key={column} >
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
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

export default HistoryPage;