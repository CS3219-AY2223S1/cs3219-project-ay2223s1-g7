import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header'
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage'
import { PrivateRoute } from './components/PrivateRoute';
import ChangepwPage from './components/ChangepwPage'
import HomePage from './components/HomePage'
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
        <div className="App">
            <div className='container'>
                <Box display={"flex"} flexDirection={"column"}>
                    <Router>
                        <Header/>
                        <Routes>
                            
                            {/* <Route exact path="/" element={<Navigate replace to="/login" />}></Route> */}
                            <Route exact path="/" element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>} />
                            
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
        </ThemeProvider>
    );
}



export default App;
