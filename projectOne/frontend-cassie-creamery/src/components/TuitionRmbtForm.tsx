import ReimbursmentRequestService from '../service/reimbursmentrequests.service';
import userService from '../service/user.service';
import {ReimbursmentRequest} from '../models/reimbursmentrequests';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { SyntheticEvent, useEffect } from 'react';
import { ReimbursmentRequestState } from '../store/reducer/reducer';
import { addReimbursmentRequest, changeReimbursmentRequest, getReimbursmentRequest } from '../store/actions/reimbursmentrequest';
import { UserState } from '../store/reducer/reducer';
import { useHistory } from 'react-router-dom';
import {hashVal} from '../helpers/hash';
import {daysinMonthOf, getDate} from '../helpers/date';
import {reimbursment} from '../helpers/reimbursment';
import {Notification} from '../models/notification';
import notificationService from '../service/notification.service';
import { changeNotification } from '../store/actions/notification';
import Nav from './Nav';

function TuitionRmbtForm() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state: UserState) => state.user );
    const request = useSelector((state: ReimbursmentRequestState) => state.reimbursmentRequest);
    let r: any = { ...request };


    function priority(today: string, start: string){

        const todayDate = new Date(today);
        const startDate = new Date(start);
        const todayMonth = todayDate.getMonth() + 1;
        const todayDay = todayDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();
        const daysleftInMonth = Number(daysinMonthOf[todayMonth.toString()] - todayDay);
        if (((todayMonth === startMonth) && ((startDay - todayDay) < 14)) ||
            ((todayMonth != startMonth) && ((daysleftInMonth+startDay) < 14))) {
                return 'urgent';
            } else {
            return 'low';
        }
    }

    function handleFormInput(e: SyntheticEvent) {
        const target = e.target as HTMLInputElement;
        r[target.name] = target.value;
        r.id = hashVal();
        r.date = getDate();
        r.username = user.username;
        r.projReim = Number(r.cost) * reimbursment[r.eventType];
        if (r.projReim === 'NaN'){
            r.projReim = 0;
        }
        if (user.availReim && user.availReim < r.projReim){
            r.projReim = user.availReim;
        }
        r.status = 'pending';
        r.currentReviewer = user.supervisor;
        r.supervisor = user.supervisor;
        r.priority = priority(r.date, r.startDate);
        if (r.gradeCutoff === 'unknown') {
            r.gradeCutoff = 'default C'
        }
        r.editAmt = 0;
        console.log('r', r);

        dispatch(changeReimbursmentRequest(r));
    }
    function submitForm() {
        let sendTo: string;
        console.log('props.reim', request);
        if (user.availReim){
            user.availReim -= r.projReim;
        }
        ReimbursmentRequestService.reimbursmentRequestSubmit(r).then(() => {
            changeReimbursmentRequest(new ReimbursmentRequest());
        });

        userService.updateUserAmt(user).then(()=>{})

        if (r.approvalEmail === 'yes') {
            sendTo = user.benCo;
        } else {
            sendTo = r.supervisor;
        }

        console.log('to', sendTo);

        notificationService.notificationSubmit({
                'id': r.id,
                'to': sendTo,
                'from': user.username,
                'subjectLine': 'NEW REIMBURSEMENT REQUEST',
                'message': '',
                'handled': 'no',
                'sent': getDate(),
                'priority': r.priority
            } as unknown as Notification).then(() => {
            changeNotification(new Notification());
        })
        history.push('/Success');
    }
    return (
        <div>


                <Nav />
                <p className="goBack" onClick={()=> history.goBack()}>Go Back</p>
                <h3 id='trmsFormTitle'>Tuition Reimbursement Form</h3>
        <div id="tform">
            {/* <form action="post" id='trmsForm'> */}
                <fieldset id="empInfo">
                    <legend>Employee Info</legend>
                    <label htmlFor="date">Date: <span>{getDate()}</span></label>
                    <div id="name">
                        <div>
                            <label htmlFor="firstname">First Name: </label>
                            <input type="text" name='firstname' onChange={handleFormInput}/>
                        </div>
                        <div>
                            <label htmlFor="lastname">Last Name: </label>
                            <input type="text" name='lastname'onChange={handleFormInput}/>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>Event Info</legend>
                    <div id="evtInfo1">
                        <div>
                            <label htmlFor="eventType">Event Type: </label>
                            <select name='eventType' onChange={handleFormInput}>
                                <option value="select">--select--</option>
                                <option value="universityCourse" defaultChecked>University Course 80%</option>
                                <option value="seminar">Seminar 60%</option>
                                <option value="prepClass">Certification Prep Class 75%</option>
                                <option value="certification">Certification 100%</option>
                                <option value="techTraining">Technical Training 90%</option>
                                <option value="other">Other 30%</option>
                            </select>
                        </div>

                        <div id="cost">
                            <div >
                                <label htmlFor="cost">Cost: $</label>
                                <input type="number" name='cost' placeholder='xxxx.xx'onChange={handleFormInput}/>
                            </div>
                            <div>
                                <label htmlFor="projReim">Projected Reimbursement:  <span>{r.projReim}</span> </label>
                            </div>
                        </div>
                    </div>
                    <div id="evtInfo2">
                        <div>
                            <label htmlFor="startDate">Start Date: </label>
                                <input type="date" name='startDate'onChange={handleFormInput}/>
                        </div>
                        <div>
                            <label htmlFor="eventTime">Event Time: </label>
                                <input type="time" name='eventTime'onChange={handleFormInput}/>
                        </div>
                    </div>
                    <div id="evtInfo3">
                        <div>
                            <label htmlFor="city">City: </label>
                            <input type="text" name='city'onChange={handleFormInput}/>
                        </div>
                        <div>
                            <label htmlFor="state">State: </label>
                            <input type="text" name='state'onChange={handleFormInput}/>
                        </div>
                    </div>

                    <fieldset>
                        <div>
                            <div id="gradeFormat">
                                <label htmlFor="gradingFormat">Grading Format: </label>
                                <select name='gradingFormat' onChange={handleFormInput} >
                                    <option value="select">--select--</option>
                                    <option value="passingGrade">Passing Grade</option>
                                    <option value="presentation">Presentation</option>
                                </select>
                            </div>
                        {r.gradingFormat === 'passingGrade' ?
                            <div>
                            <p>Please provide passing grade cutoff. If
                                unknown, please select unknown.
                            </p>
                            <label htmlFor="gradeCutoff">Passing Grade Cutoff: </label>
                            <select name='gradeCutoff' onChange={handleFormInput}>
                                <option value="select">--select--</option>
                                <option value="A">{`A (or >=90)`}</option>
                                <option value="B">{`B (or 80-89)`}</option>
                                <option value="C">{`C (or 70-79)`}</option>
                                <option value="D">{`D (or 60-69)`}</option>
                                <option value= 'unknown'>unknown</option>
                            </select>
                            {r.gradeCutoff === 'default C' ? <p>You have selected 'unknown'. Passing grade cutoff will default to 'C'.</p>  :
                            '' }
                        </div> : ''}
                        </div>
                        <div>
                        </div>
                </fieldset>
                <div id="describe">
                    <div>
                        <p>Event detail decription</p>
                        <textarea name="descr"
                                cols={50}
                                rows={4}
                                maxLength={150}
                                placeholder='Max Length 150 characters.'
                                onChange={handleFormInput}>
                        </textarea>
                    </div>
                    <div>
                        <p>Work related justification description</p>
                        <textarea name="justification"
                                cols={50}
                                rows={4}
                                maxLength={100}
                                placeholder='Max Length 100 characters.'
                                onChange={handleFormInput}>
                        </textarea>
                    </div>
                    <div>
                        <p>Approval Email?</p>
                        <input type="radio" name="approvalEmail" value="yes" onChange={handleFormInput}/>
                          <label htmlFor="approve">Yes</label>

                        <input type="radio" name="approvalEmail" value="no" onChange={handleFormInput}/>
                        <label htmlFor="deny">No</label>
                    </div>
                </div>
                </fieldset>

                <fieldset>
                    <legend>Attachments </legend>
                    <p>Add any additional documents.<span>(eg.approval documents, event-related documents, etc.)</span></p>
                    <div id="attachments">
                        <input type="file" name="attach1"/>
                        <input type="file" name="attach2"/>
                        <input type="file" name="attach3"/>
                    </div>
                </fieldset>

                <button className="buttonO" id="formSubmit" onClick={submitForm}>Submit</button>

            {/* </form> */}
        </div>
        </div>
    )
}

export default TuitionRmbtForm;