import { triggerAsyncId } from 'async_hooks';
import React, { SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import notificationService from '../service/notification.service';
import reimbursmentRequestService from '../service/reimbursmentrequests.service';
import { changeNotification, getSingleNotification } from '../store/actions/notification';
import { changeReimbursmentRequest, getReimbursmentRequest } from '../store/actions/reimbursmentrequest';
import { NotificationState, ReimbursmentRequestState, UserState } from '../store/reducer/reducer';
import {Notification} from '../models/notification';
import  Nav  from './Nav';
import userService from '../service/user.service';
import { getLoggedOutUser } from '../store/actions/user';
import { ReimbursmentRequest } from '../models/reimbursmentrequests';

interface NotificationViewProps {
    match: any;
}

const NotificationView = (props: NotificationViewProps) => {
    const user = useSelector((state: UserState) => state.user );
    const loggedOutUser = useSelector((state: UserState) => state.loggedOutUser);
    const notification = useSelector((state: NotificationState) => state.notification);
    const r = useSelector((state: ReimbursmentRequestState) => state.reimbursmentRequest);
    const history = useHistory();
    const dispatch = useDispatch();
    let approval: string = 'pending';
    console.log('approval out', approval);
    console.log('in the view b4 useeffect');
    console.log('props.match', props);
    useEffect(() => {
        notificationService.getNotification(props.match.params.id).then((results) => {
                dispatch(getSingleNotification(results));
        })
        reimbursmentRequestService.getRequest(props.match.params.id).then((result) => {
            console.log('useeffect r', result);
                dispatch(getReimbursmentRequest(result));
                userService.getUser(result.username).then((user) => {
                    dispatch(getLoggedOutUser(user));
                })

        })


    },[props.match.params.id])

    function handleChange(e: SyntheticEvent){
        const target = e.target as HTMLInputElement;
        let rq: any = {...r};
        let n: any = {...notification};
        if(target.name === 'approval'){
            if(target.value === 'approve' && user.role === 'benCo'){
                rq.status = 'awarded'
            } else if (target.value === 'deny') {
                rq.status = 'denied';
                n.to = rq.username;
            } else {
                rq.status = 'pending';
            }
        }
        if (target.name === 'reason') {
            n.message = target.value;
            notificationService.updateNotfication(n).then(() => {
                dispatch(changeNotification(n));
            })
        }
        if (target.name === 'changeAmt') {
            rq.editAmt = Number(target.value);
        }
        if (target.name === 'exceedingAvailableFundsReason') {
            rq.exceedingAvailableFundsReason = target.value;
        }

        reimbursmentRequestService.updateRequest(rq).then(()=>{
            dispatch(changeReimbursmentRequest(rq));
        })
        console.log('rrrrrrrr',r);
        console.log('nnnnnn', n);
    }

    function submitApproval(){
        let n: any = {...notification};
        let rq: any = {...r};

        if (r.status != 'denied') {
            if (user.role === 'employee' && loggedOutUser.availReim) {
                rq.status = 'awarded'
                n.subjectLine = 'Your reimbursement request has been approved!';
                n.message = `Hi ${user.username}, Your reimbursement request has been approved.`
                n.handled = 'yes';
                if (user.availReim && r.editAmt && user.availReim < r.editAmt) {
                    user.availReim = 0;
                } else if (r.editAmt && user.availReim && (user.availReim > rq.editAmt)) {
                    const newAmt = user.availReim - r.editAmt;
                    user.availReim = newAmt;
                }
                userService.updateUserAmt(user).then(()=>{})
                reimbursmentRequestService.updateRequest(rq).then(()=>{
                    dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
                })
                //i do not like the repitition here. lets make a function with this information
            }
            if (user.role === 'supervisor' && user.deptHead === user.username){
                n.to = user.benCo
            } else if (user.role === 'supervisor') {
                n.to = user.deptHead
            }
            if (user.role === 'deptHead') {
                n.to = user.benCo;
            }
            if (user.role === 'benCo') {
                console.log('n in submitApproval for BenCO', n);
                n.to = loggedOutUser.username;
                n.subjectLine = 'Your reimbursement request has been approved!';
                n.message = `Hi ${loggedOutUser.username}, Your reimbursement request has been approved.`
                n.handled = 'yes';
                console.log('n.subjectLine in Benco', n.subjectLine);
                rq.status = 'awarded';
                reimbursmentRequestService.updateRequest(rq).then(()=>{
                    dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
                })

            }
        } else {
            n.to = r.username;
            n.from = user.username;
            n.subjectLine = 'YOUR REIMBURSEMENT REQUEST HAS BEEN DENIED.'
            n.message = `Hi, ${r.username}. We regret to inform you that your reimbursement
            request has been denied for the following reason(s): ${n.message}. Thank you, ${user.username},
            ${user.role} `;
            n.handled = 'yes';
            if (loggedOutUser.availReim) {
                loggedOutUser.availReim += r.projReim
            }
            userService.updateUserAmt(user).then(()=>{})
        }
        n.from = user.username;
        console.log('you seeeee me????');
        notificationService.updateNotfication(n).then(() => {
            dispatch(changeNotification(new Notification()));
        })

        history.push('/Success');

    }

    function handleGFRequest(){
        let n: any = {...notification};
        n.to = r.username;
        n.from = user.username;
        n.subjectLine = `Need ${r.gradingFormat} submission for approval.`
        n.message = `Hi ${r.username}, In order to award your request, please provide
        an attachment of your ${r.gradingFormat} at your earliest convenience. Thanks, ${user.username}, BenCo.`;
        notificationService.updateNotfication(n).then(() => {
            dispatch(changeNotification(new Notification()));
        })
        history.push('/Success');
    }


    function editReimbursementAmount(){
        let n: any = {...notification};
        let rq: any = {...r};
        console.log('before', r);
        if(loggedOutUser.availReim && r.projReim > loggedOutUser.availReim){
            rq.exceedingAvailableFunds = 'yes'
        }
        n.to = r.username;
        n.from = user.username;
        n.subjectLine = 'Reimbursment amount change.'
        n.message = `Hi ${r.username}, There have been changes made to your reimbursement amount for the reason(s): ${rq.exceedingAvailableFundsReason}. You can either accept in which you
        will be awarded upon acceptance or you can cancel the request. Thank you,
        ${user.username}, Benco.`
        notificationService.updateNotfication(n).then(() => {
            dispatch(changeNotification(new Notification()));
        })
        console.log('before sent', rq)
        reimbursmentRequestService.updateRequest(rq).then(()=>{
            dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
        })
        console.log('after', r);
        history.push('/Success');

    }

    function cancelRequest(){
        let rq: any = {...r};
        let n: any = {...notification};
        rq.status = 'cancelled';
        n.subjectLine = 'Request Cancelled';
        n.message= 'You have cancelled this request.'
        n.from = 'cassiescreamery@info.com'
        if(user.availReim && user.availReim >= 0){
            user.availReim = user.availReim + r.projReim;
        }
        reimbursmentRequestService.updateRequest(rq).then(()=>{
            dispatch(changeReimbursmentRequest(new ReimbursmentRequest()))
        })
        notificationService.updateNotfication(n).then(() => {
            dispatch(changeNotification(new Notification()));
        })
        userService.updateUserAmt(user).then(()=>{})
        history.push('/Success');
    }


    return (
            <div>
                <Nav />
                <p className="goBack" onClick={()=> history.goBack()}>Go Back</p>
                <div id="notView">
                <p>DATE: {notification.sent}</p>
                <p>FROM: {notification.from}</p>
                <p>SUBJECT: {notification.subjectLine}</p>
                <p>MESSAGE: {notification.message}</p>
                {r.firstname ?
                    <div id="requestView">
                        <h4>REIMBURSEMENT REQUEST DETAILS</h4>
                        <div id="req">
                            <div className="requestDetail">
                                <p><span className="spanLabel">First Name:</span> {r.firstname}</p>
                                <p><span className="spanLabel">Last Name: </span>{r.lastname}</p>
                                <p><span className="spanLabel">Date Sent: </span>{r.date}</p>
                                <p><span className="spanLabel">Event Type:</span> {r.eventType}</p>
                            </div>
                            <div className="requestDetail">
                                <p><span className="spanLabel">Cost:</span> {r.cost}</p>
                                <p><span className="spanLabel">Reimbursement:</span> {r.projReim}</p>
                                {r.editAmt && r.editAmt >= 0  ? <p><span className="spanLabel">Changed Reimbursement Amount:</span> {r.editAmt} {user.availReim && r.editAmt > user.availReim ?
                            <span id="exceeding">Exceeding available funds.</span> : ''}</p> : ''}
                                <p><span className="spanLabel">Start Date:</span> {r.startDate}</p>
                                <p><span className="spanLabel">Event Time:</span> {r.eventTime}</p>
                            </div>
                            <div className="requestDetail">
                                <p><span className="spanLabel">State:</span> {r.state}</p>
                                <p><span className="spanLabel">City:</span> {r.city}</p>
                                <p><span className="spanLabel">Grade Format:</span> {r.gradingFormat}</p>
                                <p><span className="spanLabel">Status:</span> {r.status}</p>
                            </div>
                        </div>
                    </div> : ''
                }
                <div id="notificationOptions">
                {user.role != 'employee' && r.firstname?
                <div>
                    <div>
                        <div>
                          <input type="radio" name="approval" value="approve" onChange={handleChange}/>
                          <label htmlFor="approve">Approve</label>
                        </div>

                        <input type="radio" name="approval" value="deny" onChange={handleChange}/>
                        <label htmlFor="deny">Deny</label>


                        { r.status === 'denied' ?
                        <div>
                            <label htmlFor="reason">Reason For Denial</label>
                            <textarea name="reason"
                            cols={50}
                            rows={7}
                            maxLength={150}
                            required
                            onChange={handleChange}
                            >
                            </textarea>
                        </div> : ''
                        }


                        <button className="buttonO" onClick={() => history.push('/Email')}>Request Additional Info</button>
                        {user.role === 'benCo' ?
                        <div>
                            <button className="buttonO" onClick={handleGFRequest}>Request {r.gradingFormat} Submission</button>
                            <label htmlFor="changeAmt">Edit Reimbursement Amount</label>
                            <input type="number" name="changeAmt" onChange={handleChange}/>
                            {loggedOutUser.availReim && r.editAmt && (r.editAmt > (loggedOutUser.availReim + r.projReim)) ?
                            <div>
                                <label htmlFor="exceedingAvailableFundsReason">Please provide reason for exeeding available funds</label>
                                <textarea name="exceedingAvailableFundsReason"
                                cols={15}
                                rows={3}
                                required
                                onChange={handleChange}
                                >
                                </textarea>
                            </div> : ''}
                            <button  className="buttonO" onClick={editReimbursementAmount}>Send to Requestee to cancel or accept</button>
                        </div> : ''
                    }

                    </div>
                            <button className="buttonO" onClick={submitApproval}>Submit</button>
                </div> :
                <div>
                    {notification.subjectLine === 'Reimbursment amount change.' ?
                    <div>
                        <button className="buttonO" onClick={cancelRequest}>Cancel</button>
                        <button className="buttonO" onClick={submitApproval}>Accept</button>
                    </div> : ''
                }
                    <button className="buttonO" onClick={() => history.push(`/Reply/${notification.id}`)}>Reply</button>
                </div>
                }
                </div>
                </div>
            </div>
    )
}

export default NotificationView;