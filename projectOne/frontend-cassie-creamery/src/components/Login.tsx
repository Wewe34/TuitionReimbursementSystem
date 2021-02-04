import { SyntheticEvent} from 'react';
import userService from '../service/user.service';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/actions/user';
import {UserState} from '../store/reducer/reducer';

// Function Component
function LoginComponent(props: any) {
    const user = useSelector((state: UserState) => state.user );
    const dispatch = useDispatch();
    const history = useHistory();

    function handleFormInput(e: SyntheticEvent) {
        let u: any = { ...user};
        console.log('user in handle form', u);
        if((e.target as HTMLInputElement).name === 'username'){
            u.name = (e.target as HTMLInputElement).value;
        } else {
            u.password = (e.target as HTMLInputElement).value;
        }
        //why do we need this?
        dispatch(getUser(u));
        console.log('handle form.I got called after the dispatch get User inside of handle form');
    }
    function submitForm() {
        console.log('inside the submitForm button function');
        userService.login(user).then((user) => {
            dispatch(getUser(user));
            history.push('/Home');
            console.log('user in submit form', user);
        });
    }
    return (
        <div>
            <p id='about'>Here at Cassie's Creamery, we aren't interested in only Ice Cream.
                We are interested in education. For being an employee here at Cassie's Creamery, we offer
                you tuition reimbursement for continuing your education.
            </p>
            <div id="login">
                <div className="col col-lg-12 col-md-6 col-sm-8 col-xs-8" id="loginInput" >
                <span className="input-group-addon">Username</span> <input type='text' className='form-control' onChange={handleFormInput} name='username'/>
                <br/>
                Password <input type='password' className='form-control' onChange={handleFormInput} name='password'/>
                <br/>
                <button className="buttonO" onClick={submitForm}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
