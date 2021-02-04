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
        n.id = hashVal();
        n.sent = getDate();
        n.from = user.username;
        console.log('n', n);
        dispatch(changeNotification(n));
    }
    function submitForm() {
        let rq: any = {...r};
        if (n.subjectLine === 'submission example') {
            rq.gradePresSubmission = 'yes'
        }
        reimbursmentRequestService.updateRequest(rq).then(()=>{
            dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
        })
        notificationService.notificationSubmit(n).then(() => {
            changeNotification(new Notification());
            //if error send to error page
            history.push('/Success');
        });
    }
    return (

        <div id="email">
            <Nav />
            <p className="goBack" onClick={()=> history.goBack()}>Go Back</p>
            <h3>New Message</h3>
            <p>From: {user.username}</p>
            <div id="toSub">
                <div>
                    <label htmlFor="to">To:</label>
                    <input type="text" name="to" onChange={handleFormInput}/>
                </div>
                <div>
                    <label htmlFor="subjectLine">Subject:</label>
                    <input type="text" name="subjectLine" maxLength={40} onChange={handleFormInput}/>
                </div>
            </div>
            <div>
            <textarea
                    name="message"
                    cols={100}
                    rows={13}
                    onChange={handleFormInput}>
            </textarea>
            {/* add an attachment option */}
            <div>
            <   button className="buttonO" onClick={submitForm}>Send</button>
            </div>
            </div>
        </div>
    );
}

export default NotificationForm;