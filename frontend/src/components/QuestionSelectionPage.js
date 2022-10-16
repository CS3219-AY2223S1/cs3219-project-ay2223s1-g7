import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    Rating,
    CardMedia,
} from "@mui/material";
import React, { useState } from "react";
import Flippy, { FrontSide, BackSide } from 'react-flippy';

function QuestionSelectionPage(props) {
    const [isFirstRaised, setIsFirstRaised] = useState(false);
    const [isSecondRaised, setIsSecondRaised] = useState(false);
    const [isThirdRaised, setIsThirdRaised] = useState(false);

    return (
        <Box>
            <Typography variant={"h3"} textAlign={"center"} marginBottom={"2rem"}>Choose difficulty</Typography>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} sx={{ 'button': { m: 1 } }} style={{ "flex-wrap": "wrap" }}>

                <div className="blob" style={{margin: "1.2em"}}>
                    <Flippy
                        flipOnHover={true}
                        flipOnClick={false}
                        flipDirection="horizontal">
                        <FrontSide>
                            <Card
                                onMouseOver={() => setIsFirstRaised(!isFirstRaised)}
                                onMouseOut={() => setIsFirstRaised(!isFirstRaised)}
                                raised={isFirstRaised}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "25vw",
                                    minWidth: "300px",
                                    maxWidth: "400px",
                                    height: "auto",
                                    border: "1px solid #000000",
                                }}
                                onClick={() => props.handleMatching("EASY")}
                            >
                                <CardMedia
                                    component="img"
                                    image={'/easy.png'}
                                    marginTop={"1rem"}
                                    marginLeft={"1rem"}
                                    height={"100%"}
                                />
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems="center"
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                >
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginLeft={"1rem"} marginBottom={"1rem"}>
                                        Easy
                                    </Typography>
                                    <Rating size="large" value={1} max={3} readOnly />
                                </Box>
                            </Card>
                        </FrontSide>
                        <BackSide style={{ backgroundColor: '#b3ffcc', display: "flex", flexDirection: "column", justifyContent: "center" }} onClick={() => props.handleMatching("EASY")}>
                            <h2 style={{ textAlign: "center" }}>Preview of an easy question:</h2>
                            <h3>Given an array of integers and an integer target, return indices of the
                                two numbers such that they add up to target.
                            </h3>
                            <h4 style={{ textAlign: "center" }}>Ready to start? Click me:)
                            </h4>
                        </BackSide>
                    </Flippy>
                </div>


                <div className="blob" style={{margin: "1.2em"}}>
                    <Flippy
                        flipOnHover={true}
                        flipOnClick={false}
                        flipDirection="horizontal">
                        <FrontSide>
                            <Card
                                onMouseOver={() => setIsSecondRaised(!isSecondRaised)}
                                onMouseOut={() => setIsSecondRaised(!isSecondRaised)}
                                raised={isSecondRaised}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "25vw",
                                    minWidth: "300px",
                                    maxWidth: "400px",
                                    height: "auto",
                                    border: "1px solid #000000"
                                }}
                                onClick={() => props.handleMatching("MEDIUM")}
                            >
                                <CardMedia
                                    component="img"
                                    // <a href="https://storyset.com/business">Business illustrations by Storyset</a>
                                    image={'/medium.png'}
                                    marginTop={"1rem"}
                                    marginLeft={"1rem"}
                                    height={"100%"}
                                />
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems="center"
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                >
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginLeft={"1rem"} marginBottom={"1rem"}>
                                        Medium
                                    </Typography>
                                    <Rating size="large" value={2} max={3} readOnly />
                                </Box>
                            </Card>
                        </FrontSide>
                        <BackSide style={{ backgroundColor: '#ffbf80', display: "flex", flexDirection: "column", justifyContent: "center" }} onClick={() => props.handleMatching("MEDIUM")}>
                            <h2 style={{ textAlign: "center" }}>Preview of a medium question:</h2>
                            <h3>
                                Given two integers a and b, return all possible combinations of b numbers chosen from the range [1, a].
                            </h3>
                            <h4 style={{ textAlign: "center" }}>Ready to start? Click me:)
                            </h4>
                        </BackSide>
                    </Flippy>
                </div>

                <div className="blob" style={{margin: "1.2em"}}>
                    <Flippy
                        flipOnHover={true}
                        flipOnClick={false}
                        flipDirection="horizontal">
                        <FrontSide>
                            <Card
                                onMouseOver={() => setIsThirdRaised(!isThirdRaised)}
                                onMouseOut={() => setIsThirdRaised(!isThirdRaised)}
                                raised={isThirdRaised}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "25vw",
                                    minWidth: "300px",
                                    maxWidth: "400px",
                                    height: "auto",
                                    border: "1px solid #000000"
                                }}
                                onClick={() => props.handleMatching("HARD")}
                            >
                                <CardMedia
                                    component="img"
                                    image={'/hard.png'}
                                    marginTop={"1rem"}
                                    marginLeft={"1rem"}
                                    height={"100%"}
                                />
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems="center"
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                >
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginLeft={"1rem"} marginBottom={"1rem"}>
                                        HARD
                                    </Typography>
                                    <Rating size="large" value={3} max={3} readOnly />
                                </Box>
                            </Card>
                        </FrontSide>
                        <BackSide style={{ backgroundColor: '#ff8080', display: "flex", flexDirection: "column", justifyContent: "center" }} onClick={() => props.handleMatching("HARD")}>
                            <h2 style={{ textAlign: "center" }}>Preview of a hard question:</h2>
                            <h3>
                                Given a string s representing a valid expression, implement a basic calculator(without using any built in function) to evaluate it,
                                and return the result of the evaluation.
                            </h3>
                            <h4 style={{ textAlign: "center" }}>Ready to start? Click me:)
                            </h4>
                        </BackSide>
                    </Flippy>
                </div>
            </Box>
        </Box>
    )
}

export default QuestionSelectionPage;