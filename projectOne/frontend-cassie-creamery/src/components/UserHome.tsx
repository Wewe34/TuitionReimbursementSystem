import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import notificationService from '../service/notification.service';
import { getAllNotifications } from '../store/actions/notification';
import { NotificationState, UserState } from '../store/reducer/reducer';
import  Nav  from './Nav';
const UserHome = () => {
    const user = useSelector((state: UserState) => state.user );
    const notifications = useSelector((state: NotificationState) => state.notifications);
    const history = useHistory();
    const dispatch = useDispatch();
    const tableHeaders = ['from', 'subject', 'status', 'date'];
    useEffect(() => {
        notificationService.getAllNotifications(user.username).then((results) => {
                console.log('results', results);
                dispatch(getAllNotifications(results));
        })
    }, [user.username])
    console.log('notifications', notifications);
    return (
            <div id="userHomeContainer">
                <Nav />
                <div id="welcome">
                    <h3>Welcome, {user.username.toUpperCase()}!<span>....</span></h3>
                    <img src={`https://robohash.org/${user.username}`} alt="robohash" id="userImg"/>
                {user.role === 'employee' ?
                <p id="availReim">Available Reimbursement: {user.availReim}</p> : ''
                }
                </div>
                {!user.username ? (
                    history.push('/Login')
                ) : ''
                }
                <div>
                    <h3 id="notificationC">Notification Center ({notifications ? notifications.length : 0})</h3>
                <div id="notificationCenterContainer">
                    <table>
                            {notifications ? notifications.map(notification => {
                                console.log('not id', notification.id);
                                return <tr key={notification.id} id="notification">
                                            <td>{notification.from.toUpperCase()}</td>
                                            <td><Link to={'/Notification/'+notification.id}>{notification.subjectLine}</Link></td>
                                            {notification.priority === 'urgent' ?
                                                <td>URGENT</td> : ''
                                        }
                                            <td>{notification.sent}</td>
                                        </tr>
                            }) : 'No notifications at this time.'}
                    </table>
                </div>
                </div>
            </div>
    )
}

export default UserHome;

{/* <thead>
<tr>
    <th>from</th>
    <th>subject</th>
    <th>status</th>
    <th>date</th>
</tr>
</thead> */}