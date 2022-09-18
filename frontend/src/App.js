import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from './components/Header'
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import QuestionSelectionPage from './components/QuestionSelectionPage'
import {Box} from "@mui/material";
import QuestionSelectionPage from './components/QuestionSelectionPage'

function App() {
    return (
        
        <div className="App">
            <Header />
            <div className='container'>
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/home" element={<QuestionSelectionPage/>}/>
                    </Routes>
                </Router>
            </Box>
            </div>
        </div>
    );
}

export default App;
