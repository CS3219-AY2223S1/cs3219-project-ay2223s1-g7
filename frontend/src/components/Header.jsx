import { FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { Fragment } from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";

import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_OK} from "../constants";



function Header() {
  const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
          // will implement something better after changing Header to a route -> useLocation, check in list of protected places
          if (window.location.pathname === "/login" || window.location.pathname === "/signup" ) {
              setLoggedIn(false)
          }
          else {
            setLoggedIn(true)
          }
    });

      const handleLogout = async () => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(token){
            const res = await axios.post(URL_USER_SVC + '/logout', {token})
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    console.log(err)
                }
                else {
                }
            })

            if (res.status === STATUS_CODE_OK) {
              // document.cookie = "jwt_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
              // document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
              window.location.href="http://localhost:3000/login"
            }
          }
        }
  
    const guestLinks = (<Fragment><li>
        <a href="/signup">
          <FaUser /> Register
        </a>
        </li>
        <li>
        <a href="/login">
          <FaSignInAlt /> Login
        </a> 
        </li></Fragment>);
    
    const authLinks = (<Fragment>
      <li>
      <a href="/home">
        <FaSignInAlt /> Home
      </a>
      </li>
      <li>
      <a href="/settings">
        <FaSignInAlt /> Settings
      </a>
      </li>
      <li>
      <a>
      
      <Button color={"primary"} style={{float: 'right', color: 'white', marginTop:'2px'}}
                onClick={() => handleLogout()} ><FaSignOutAlt />Logout</Button>
                </a></li>
      </Fragment>);

  return (
    <header className="header">
      <div className='logo'>
        CS3219
      </div>
      <ul>
      {loggedIn ? authLinks : guestLinks}
      </ul>
    </header>
  )
}

export default Header