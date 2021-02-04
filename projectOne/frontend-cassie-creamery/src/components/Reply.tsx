import { SyntheticEvent} from 'react';
import userService from '../service/user.service';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeNotification } from '../store/actions/notification';
import { changeReimbursmentRequest } from '../store/actions/reimbursmentrequest';
import {NotificationState, UserState, ReimbursmentRequestState} from '../store/reducer/reducer';
import { Notification } from '../models/notification';
import {hashVal} from '../helpers/hash';
import {getDate} from '../helpers/date';
import notificationService from '../service/notification.service';
import reimbursmentRequestService from '../service/reimbursmentrequests.service';
import { ReimbursmentRequest } from '../models/reimbursmentrequests';
import Nav from './Nav';

// Function Component
function NotificationForm(props: any) {
    const user = useSelector((state: UserState) => state.user );
    const notification = useSelector((state: NotificationState) => state.notification);
    const r = useSelector((state: ReimbursmentRequestState) => state.reimbursmentRequest);
    const dispatch = useDispatch();
    const history = useHistory();
    let n: any = {...notification};

    function handleFormInput(e: SyntheticEvent) {
        const target = e.target as HTMLInputElement;
        n[target.name] = target.value;
        dispatch(changeNotification(n));
    }
    function submitForm() {
        let rq: any = {...r};
        let n: any = {...notification};
        n.to = notification.from;
        n.from = user.username;
        n.subjectLine = `Re: ${notification.subjectLine}`;
        rq.gradePresSubmission = 'yes';
        console.log('rq',rq);
        console.log('n', n);
        reimbursmentRequestService.updateRequest(rq).then(()=>{
            dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
        })
        notificationService.updateNotfication(n).then(() => {
            dispatch(changeNotification(new Notification()));
            //if error send to error page
            history.push('/Success');
        });
    }
    return (

        <div id="email">
            <Nav />
            <p className="goBack" onClick={()=> history.goBack()}>Go Back</p>
            <h3>Reply</h3>
            <p>From: {user.username}</p>
            <p>To: {notification.from}</p>
            <p>Subject: Re: {notification.subjectLine}</p>
            <textarea
                    name="message"
                    cols={100}
                    rows={13}
                    onChange={handleFormInput}>
            </textarea>
            <button className="buttonO" onClick={submitForm}>Send</button>
        </div>
    );
}

export default NotificationForm;