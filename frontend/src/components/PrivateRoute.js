import React from 'react';
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_OK} from "../constants";
import { useState, useEffect} from "react";
import { Navigate} from "react-router-dom";

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
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const res = await axios.post(URL_USER_SVC + '/authenticate', {token})
        .catch((err) => {
            return false
        })
    if (res && res.status === STATUS_CODE_OK) {
        return true
    }
    return false
}

