import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";



function QuestionPage(props) {

    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Question</Typography>
            <TextField multiline rows={10} onChange={props.handleTextChange} value={props.text} />
            <Button variant={"contained"} color={"error"} onClick={() => props.handleExit()}>Exit</Button>
        </Box>
    )
}

export default QuestionPage;