from the form to dynamodb
id(username+tracker)
username,
last name,
first name,
date submitted
event type
cost
projected reimbursment
start date
end date
event time
state
city
grading format
passing grade cutoff

also to include:
status(pending,awarded),
currentlyReviewing (supervisor, deptHead, BenCo, employee),
priority,
tracker(number attached ti id at time of request creation)

from form to s3
description of event
decription why work related
attachments
presentation submission

employee stories

Once logged In has options to:
⌾submit form
    -places everything in dynamoDB and S3 bucket
    -redrects to home page
⌾view notification/list to do
    -show '(Benco or Supervisor or DeptHead) is requesting additional info
    -show Benco requesting passing grade or presentation submission
    -show Benco requesting Employees acceptance of $ change.
    -show request has been awarded or denied
⌾rejected requests
    -include reason for denial
⌾awarded requests
    -include amount awarded
    -include total amount for the year,
⌾pending requests
    -show who is currently reviewing
⌾all requests
    -will have to filter for pending, denied, and awarded.

⌾Can see available reimbursement on dash
    -amount changes programatically depending on the status of requests
    -think of how you want the layout to look like.



as of Jan 12 night. then go back over your user stories. Might need to add deptHead, supervisor and Benco to user to show who their specific authority is.

The rest is systematic stuff like adding the requests under the notification, changing the available amt and etc. Then styling.


Jan. 17: in the midst of changing notification types to know which buttons to display. only changed request so far. added a type to notification model

What to do:
Requests:
    -Link to view all requests made or handled, can be filtered by rejected, accepted, awarded, pending.
Notifications
Types: Requests, Additional Info both request/respond, passing grade approval request/respond, Approve/Deny with Reason, Attachments like approval email, presentation, additional info
    -If request, will show read Only detail view with options depending on who
    -Add attachments option



// id = '';; make a unique id -----
// username = '';; get from user state useSelector ------
// lastname = '';; ----- case senstive? not imp ------
// firstname = '';; ------- case sensitive? not imp -----
// date = '';  -----------
// eventType = ''; ----------------
// cost = 0; ------------------ allow .?
// projReim = 0 max is availReimAmt, need % calculated before placed in db --------
// startDate = ''; -------------- diff format?
// endDate = ''; ------------- diff format?
// eventTime = ''; -------------- diff format?
// state = ''; ---------------- abbreviations or full?, case sensitive? not important-----
// city = ''; --------------- case senstive? nt imp----------
// gradingFormat = ''; ----------------
// status = ''; initially is pendingm-------
// currentReviewer = ''; request should include user's supervisor and user's deptHead. update ------
//currentReviewer when approved
// priority = ''; if date is 2 weeks from start day, mark as urgent otherwise Low. --------
// tracker = '';  might not need this if you make a hash function ---------
// gradeCutoff? = ''; -------- by letter grade -------------





import ReimbursmentRequestService from '../service/reimbursmentrequests.service';
import {ReimbursmentRequest} from '../models/reimbursmentrequests';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { SyntheticEvent, useEffect } from 'react';
import { ReimbursmentRequestState } from '../store/reducer/reducer';
import { addReimbursmentRequest, changeReimbursmentRequest, getReimbursmentRequest } from '../store/actions/reimbursmentrequest';
import { UserState } from '../store/reducer/reducer';
import { useHistory } from 'react-router-dom';
import hashVal from '../hash';


const reimbursmentRequestProp = (state: ReimbursmentRequestState) => ({reimbursmentRequest: state.reimbursmentRequest});
// This is the dispatcher I want to use from redux
const mapDispatch = {
    updateReimbursmentRequest: (reimbursmentRequest: ReimbursmentRequest) => changeReimbursmentRequest(reimbursmentRequest),
};
// Put them in the connector
const connector = connect(reimbursmentRequestProp, mapDispatch);

// Function Component
// get the types of the props we created above so we can tell our component about them.
type PropsFromRedux = ConnectedProps<typeof connector>;

function TuitionRmbtForm(props: PropsFromRedux) {
    const history = useHistory();
    const user = useSelector((state: UserState) => state.user );
    let pReim;
    let r: any = { ...props.reimbursmentRequest };
    const reimbursment: any = {
        universityCourse: .8,
        seminar: .6,
        prepClass: .75,
        certification: 1,
        techTraining: .9,
        other: .3
    }

    const daysinMonthOf: any = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }

    function priority(today: string, start: string){

        const todayDate = new Date(today);
        const startDate = new Date(start);
        const todayMonth = todayDate.getMonth() + 1;
        const todayDay = todayDate.getDate();
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();
        const daysleftInMonth = Number(daysinMonthOf[todayMonth.toString()] - todayDay);
        if ((todayMonth === startMonth) && ((startDay - todayDay) < 14)) {
            if ((todayMonth != startMonth) && ((daysleftInMonth+startDay) < 14)) {
                return 'urgent';
            }
        } else {
            return 'low';
        }
    }

    function handleFormInput(e: SyntheticEvent) {
        console.log('I am the reimbursmentRequest in handle', props.reimbursmentRequest);

        const target = e.target as HTMLInputElement;
        r[target.name] = target.value;
        r.id = hashVal;
        r.username = user.username;
        r.projReim = Number(r.cost) * reimbursment[r.eventType];
        pReim = r.projReim;
        r.status = 'pending';
        r.currentReviewer = user.supervisor;
        r.supervisor = user.supervisor;
        r.priority = priority(r.date, r.startDate);
        console.log('r', r);
        props.updateReimbursmentRequest(r);
    }
    function submitForm() {
        console.log('props.reim', props.reimbursmentRequest);
        ReimbursmentRequestService.reimbursmentRequestSubmit(r).then(() => {
            props.updateReimbursmentRequest(new ReimbursmentRequest());
            // call the callback function from the parent component so that it will re-render
            history.push('/');
        });
    }
    return (
        <div>
            {/* <form action="post" id='trmsForm'> */}
                <legend id='trmsFormTitle'>Tuition Reimbursement Form</legend>
                <fieldset>
                    <legend>Employee Info</legend>
                    <label htmlFor="lastname">Last Name: </label>
                    <input type="text" name='lastname'onChange={handleFormInput}/>
                    <label htmlFor="firstname">First Name: </label>
                    <input type="text" name='firstname' onChange={handleFormInput}/>
                    <label htmlFor="date">Date: </label>
                    <input type="date" name="date" onChange={handleFormInput}/>
                </fieldset>

                <fieldset>
                    <legend>Event Info</legend>
                    <div>
                        <label htmlFor="eventType">Event Type: </label>
                        <select name='eventType' onChange={handleFormInput}>
                            <option value="universityCourse" defaultChecked>University Course</option>
                            <option value="seminar">Seminar</option>
                            <option value="prepClass">Certification Prep Class</option>
                            <option value="certification">Certification</option>
                            <option value="techTraining">Technical Training</option>
                            <option value="other">Other</option>
                        </select>
                        <label htmlFor="cost">Cost: $</label>
                        <input type="number" name='cost' placeholder='xxxx.xx'onChange={handleFormInput}/>
                        <label htmlFor="projReim">Projected Reimbursement: </label>
                        <p>{r.projReim}</p>
                    </div>
                    <div>
                        <p>Please give a detail description of the event.</p>
                        <textarea name="descr"
                                cols={50}
                                rows={7}
                                maxLength={150}
                                placeholder='Max Length 150 characters.'
                                onChange={handleFormInput}>
                        </textarea>
                    </div>
                    <div>
                        <label htmlFor="startDate">Start Date: </label>
                            <input type="date" name='startDate'onChange={handleFormInput}/>
                        <label htmlFor="endDate">End Date: </label>
                            <input type="date" name='endDate'onChange={handleFormInput}/>
                    </div>
                    <div>
                        <label htmlFor="eventTime">Event Time: </label>
                            <input type="time" name='eventTime'onChange={handleFormInput}/>
                        <label htmlFor="state">State: </label>
                        <input type="text" name='state'onChange={handleFormInput}/>
                        <label htmlFor="city">City: </label>
                        <input type="text" name='city'onChange={handleFormInput}/>
                    </div>

                    <fieldset>
                        <legend>Grading Format: </legend>
                        <select name='gradingFormat' onChange={handleFormInput}>
                            <option value="passingGrade" defaultChecked>Passing Grade</option>
                            <option value="presentation">Presentation</option>
                        </select>
                        <div>
                            <p>If 'Passing Grade' is checked, please provide passing grade cutoff or
                                keep default option 'C' if unknown.
                            </p>
                            <label htmlFor="gradeCutoff">Passing Grade Cutoff: </label>
                            <select name='gradeCutoff' onChange={handleFormInput}>
                                <option value="A">{`A (or >=90)`}</option>
                                <option value="B">{`B (or 80-89)`}</option>
                                <option value="C" defaultChecked>{`C (or 70-79)`}</option>
                                <option value="D">{`D (or 60-69)`}</option>
                            </select>
                        </div>
                    </fieldset>

                    <div>
                        <p>Please describe how the event is a work related justification.</p>
                        <textarea name="justification"
                                cols={50}
                                rows={4}
                                maxLength={100}
                                placeholder='Max Length 100 characters.'
                                onChange={handleFormInput}>
                        </textarea>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Attachments </legend>
                    <p>Add any additional documents.<span>(eg.approval documents, event-related documents, etc.)</span></p>
                    <input type="file" name="attach1"/>
                    <input type="file" name="attach2"/>
                    <input type="file" name="attach3"/>
                </fieldset>

                <button id="formSubmit" onClick={submitForm}>Submit</button>

            {/* </form> */}
        </div>

    )
}

export default connector(TuitionRmbtForm);