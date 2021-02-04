import { useDispatch } from "react-redux";
import userService from "../service/user.service";
import { getUser } from '../store/actions/user';
import { User } from '../models/user';
import React from "react";
import { Link } from "react-router-dom";

const LogoutComponent = () => {
    const dispatch = useDispatch();

    function logout(){userService.logout().then(() => {
        dispatch(getUser(new User()));
        });
    }
    return (
        <Link to="/Login" id='logout' onClick={logout} className="nav">Logout</Link>
    )
}

export default LogoutComponent;