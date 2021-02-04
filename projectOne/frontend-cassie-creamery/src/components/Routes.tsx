import React from 'react';
import {
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import Login from './Login';
import { NotificationState, UserState } from '../store/reducer/reducer';
import {useSelector} from 'react-redux';
import TuitionRmbtForm from './TuitionRmbtForm';
import UserHome from './UserHome';
import NotificationForm from './NotificationForm';
import NotificationView from './NotificationView';
import Success from './Success';
import Reply from './Reply';



const Routes = () => {
    const user = useSelector((state: UserState) => state.user);
    const notification = useSelector((state: NotificationState) => state.notification);
    console.log('USERRR', user)
    return (
        <Switch>
                <Route exact path='/Login' render={()=> !user.username ? <Login /> : <Redirect to='/Home' />} />
                <Route
                path='/ReimbursmentRequest'
                render={() =>
                    !user.username ? (
                        <Redirect to='/Login' />
                    ) : (
                        <TuitionRmbtForm />
                    )
                }
                />
                <Route exact path='/Home' component={UserHome}></Route>
                <Route exact path='/' render={() => <Redirect to='Login' />}></Route>
                <Route exact path='/Email' component={NotificationForm} />
                <Route path='/Notification/:id' component={NotificationView}></Route>
                <Route exact path='/Success' component={Success}></Route>
                <Route path='/Reply/:id' component={Reply}></Route>
        </Switch>
    );
}

export default Routes;
