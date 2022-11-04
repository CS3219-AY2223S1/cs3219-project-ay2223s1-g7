import React from 'react';
import { STATUS_CODE_OK } from "../constants";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { userApi } from '../apis/api.js'

export const PrivateRoute = ({ children }) => {
    const [authorized, setAuthorized] = useState();

    useEffect(() => {
        const authorize = async () => {
            try {
                const auth_result = await isAuth();
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

async function isAuth() {
    const res = await userApi.post('/authenticate', {})
        .catch((err) => {
            return false
        })
    console.log(res)
    if (res && res.status === STATUS_CODE_OK) {
        return true
    }
    return false
}

