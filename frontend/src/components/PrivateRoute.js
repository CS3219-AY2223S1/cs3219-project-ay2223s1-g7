import React from 'react';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {authenticate} from '../utils/authentication.js'


export const PrivateRoute = ({ children }) => {
    const [authorized, setAuthorized] = useState();

    useEffect(() => {
        const authorize = async () => {
            try {
                const auth_result = await authenticate();
                setAuthorized(auth_result);
            } catch (err) {
                console.log(err)
                setAuthorized(false);
            }
        };

        authorize();
    }, []);  // empty array means runs once, else is called twice


    if (authorized === undefined) {
        return null; // or loading indicator/spinner/etc
    }

    return authorized ? children : <Navigate to="/login" />;
};

