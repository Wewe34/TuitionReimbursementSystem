import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import userService from '../service/user.service';
import { useSelector } from 'react-redux';
import { UserState } from '../store/reducer/reducer';
import EmployeeNav from './EmployeeNav';
import BenCoNav from './BenCoNav';
import DeptHeadSupervisorNav from './DeptHeadSupervisorNav';
import Header from './Header';

const Nav = () => {
    const user = useSelector((state: UserState) => state.user);
    const history= useHistory();
    return (
        <div>
            <nav id='nav'>
                        {user?.username ? (
                            user.role === 'employee' ?
                            <div>
                                <EmployeeNav />
                            </div> :
                            user.role === 'benCo' ?
                            <div>
                                <BenCoNav />
                            </div> :
                            <div>
                                <DeptHeadSupervisorNav />
                            </div>
                        ) : (
                            <Link to='/Login'>Login</Link>
                        )}
            </nav>
        </div>
    )
}

export default Nav;