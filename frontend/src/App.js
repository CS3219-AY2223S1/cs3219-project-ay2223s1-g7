import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header'
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage'
import { PrivateRoute } from './components/PrivateRoute';
import ChangepwPage from './components/ChangepwPage'
import HomePage from './components/HomePage'
import { Box } from "@mui/material";

function App() {
    return (

        <div className="App">
            <Header />
            <div className='container'>
                <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />



                            <Route path="/settings" element={
                                <PrivateRoute>
                                    <SettingsPage />
                                </PrivateRoute>} />
                            <Route path="/changepw" element={
                                <PrivateRoute>
                                    <ChangepwPage />
                                </PrivateRoute>} />
                            <Route path="/home" element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>} />
                            <Route path="/loading" element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>} />
                            <Route path="/question" element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>} />
                            <Route path="*" element={<div>
                                <h2>404 Page not found</h2>
                            </div>} />

                        </Routes>
                    </Router>
                </Box>
            </div>
        </div>
    );
}



export default App;
