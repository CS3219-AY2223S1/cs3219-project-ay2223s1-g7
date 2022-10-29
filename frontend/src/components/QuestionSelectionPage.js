import {
    Box,
    Typography,
    Rating,
    CardMedia,
} from "@mui/material";
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import './QuestionSelectionPage.css'

function QuestionSelectionPage(props) {
    const [isFirstRaised, setIsFirstRaised] = useState(false);
    const [isSecondRaised, setIsSecondRaised] = useState(false);
    const [isThirdRaised, setIsThirdRaised] = useState(false);

    return (
        <Box padding={"1rem"}>
            <Typography variant={"h4"} textAlign={"center"} marginTop={"2rem"} marginBottom={"2rem"}>Select your difficulty level</Typography>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} sx={{ 'button': { m: 1 }, flexWrap: 'wrap' }} >

                {/* https://stackoverflow.com/questions/67222758/react-transition-group-card-flip-animation */}
                <div className="card-container">
                    <button className="card-button"
                        onMouseEnter={() => setIsFirstRaised(true)}
                        onMouseLeave={() => setIsFirstRaised(false)}
                        onClick={() => props.handleMatching("EASY")}
                    >
                        <CSSTransition
                            in={!isFirstRaised}
                            timeout={1000}
                            classNames="front-face-transition"
                        // unmountOnExit
                        >
                            <div className="card-front">
                                <CardMedia
                                    component="img"
                                    image={'/easy.png'}
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
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginRight={"1rem"}>
                                        <Rating size="large" value={1} max={3} readOnly />
                                    </Typography>
                                </Box>
                            </div>
                        </CSSTransition>
                        <CSSTransition
                            in={isFirstRaised}
                            timeout={1000}
                            classNames="back-face-transition"
                            unmountOnExit
                        >
                            <div className="card-back" style={{ backgroundColor: '#b3ffcc', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                <Typography variant="h5" marginBottom="2rem" textAlign={"center"}>
                                    <strong>Preview of an easy question:</strong>
                                </Typography>
                                <Typography variant="h6" marginBottom="1rem" textAlign={"center"}>
                                    Given an array of integers and an integer target, return indices of the
                                    two numbers such that they add up to target.
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        color: 'black',
                                        borderColor: 'black',
                                        padding: 1,
                                        border: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" textAlign={"center"}>Click to start
                                    </Typography>

                                </Box>
                            </div>
                        </CSSTransition>
                    </button>
                </div>

                <div className="card-container">
                    <button className="card-button"
                        onMouseEnter={() => setIsSecondRaised(true)}
                        onMouseLeave={() => setIsSecondRaised(false)}
                        onClick={() => props.handleMatching("MEDIUM")}
                    >
                        <CSSTransition
                            in={!isSecondRaised}
                            timeout={1000}
                            classNames="front-face-transition"
                        >
                            <div className="card-front">
                                <CardMedia
                                    component="img"
                                    // <a href="https://storyset.com/business">Business illustrations by Storyset</a>
                                    image={'/medium.png'}
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
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginRight={"1rem"}>
                                        <Rating size="large" value={2} max={3} readOnly />
                                    </Typography>
                                </Box>
                            </div>
                        </CSSTransition>
                        <CSSTransition
                            in={isSecondRaised}
                            timeout={1000}
                            classNames="back-face-transition"
                            unmountOnExit
                        >
                            <div className="card-back" style={{ backgroundColor: '#ffbf80', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                <Typography variant="h5" marginBottom="2rem" textAlign={"center"}>
                                    <strong>Preview of a medium question:</strong>
                                </Typography>
                                <Typography variant="h6" marginBottom="1rem" textAlign={"center"}>
                                    Given two integers a and b, return all possible combinations of b numbers chosen from the range [1, a].
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        color: 'black',
                                        borderColor: 'black',
                                        padding: 1,
                                        border: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" textAlign={"center"}>Click to start
                                    </Typography>

                                </Box>
                            </div>
                        </CSSTransition>
                    </button>
                </div>

                <div className="card-container">
                    <button className="card-button"
                        onMouseEnter={() => setIsThirdRaised(true)}
                        onMouseLeave={() => setIsThirdRaised(false)}
                        onClick={() => props.handleMatching("MEDIUM")}
                    >
                        <CSSTransition
                            in={!isThirdRaised}
                            timeout={1000}
                            classNames="front-face-transition"
                        >
                            <div className="card-front">
                                <CardMedia
                                    component="img"
                                    image={'/hard.png'}
                                />
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems="center"
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                >
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginLeft={"1rem"} marginBottom={"1rem"}>
                                        Hard
                                    </Typography>
                                    <Typography variant="h5" textAlign={"center"} marginTop={"1rem"} marginRight={"1rem"}>

                                        <Rating size="large" value={3} max={3} readOnly />
                                    </Typography>
                                </Box>
                            </div>
                        </CSSTransition>
                        <CSSTransition
                            in={isThirdRaised}
                            timeout={1000}
                            classNames="back-face-transition"
                            unmountOnExit
                        >
                            <div className="card-back" style={{ backgroundColor: '#ff8080', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                <Typography variant="h5" marginBottom="2rem" textAlign={"center"}>
                                    <strong>Preview of a hard question:</strong>
                                </Typography>
                                <Typography variant="h6" marginBottom="1rem" textAlign={"center"}>
                                    Given a string s representing a valid expression, implement a basic calculator(without using any built in function) to evaluate it,
                                    and return the result of the evaluation.
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        color: 'black',
                                        borderColor: 'black',
                                        padding: 1,
                                        border: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" textAlign={"center"}>Click to start
                                    </Typography>

                                </Box>
                            </div>
                        </CSSTransition>
                    </button>
                </div>


            </Box>
        </Box>
    )
}

export default QuestionSelectionPage;