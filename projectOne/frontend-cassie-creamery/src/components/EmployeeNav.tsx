import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { UserState } from '../store/reducer/reducer';
import LogoutComponent from './Logout';
const EmployeeNav = () => {
    const user = useSelector((state: UserState) => state.user );
    const history = useHistory();
    return (
            <div className="navContainer">
                <Link to='/Home' className="nav">Home</Link>
                <Link to='/ReimbursmentRequest' className="nav">New Reimbursement Request</Link>
                <Link to='/Email' className="nav">Email</Link>
                <LogoutComponent />
            </div>
    )
}

export default EmployeeNav;