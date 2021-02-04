import { Link } from 'react-router-dom';
import LogoutComponent from './Logout';
const DeptHeadSupervisorNav = () => {
    return (
            <div className="navContainer">
                <Link to='/' className="nav">Home</Link>
                <Link to='/Email' className="nav">Email</Link>
                <LogoutComponent />
            </div>
    )
}

export default DeptHeadSupervisorNav;