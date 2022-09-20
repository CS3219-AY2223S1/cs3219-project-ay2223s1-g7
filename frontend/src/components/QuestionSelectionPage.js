import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
function QuestionSelectionPage(props) {

    return (
        <Box display={"flex"} flexDirection={"column"} alignSelf={"center"} width={"50%"} sx={{ 'button': { m: 1 } }}>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Choose difficulty</Typography>
            <Button variant={"contained"} color={"success"} onClick={() => props.handleMatching("EASY")}>EASY</Button>
            <Button variant={"contained"} color={"warning"} onClick={() => props.handleMatching("MEDIUM")}>MEDIUM</Button>
            <Button variant={"contained"} color={"error"} onClick={() => props.handleMatching("HARD")}>HARD</Button>
        </Box>
    )
}

export default QuestionSelectionPage;