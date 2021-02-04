import { ReimbursmentRequest } from "../../models/reimbursmentrequests";
import { User } from "../../models/user";
import {Notification} from '../../models/notification'
import { AppAction } from "../actions/app-action";


export interface UserState {
    user: User,
    loggedOutUser: User
}

export interface ReimbursmentRequestState {
    // The list of all reimbursmentRequests, loaded from the db.
    reimbursementRequests: ReimbursmentRequest[],
    reimbursmentRequest: ReimbursmentRequest;
}

export interface NotificationState {
    notifications: Notification[],
    notification: Notification,
    notificationType: string
}

export interface AppState extends UserState, ReimbursmentRequestState, NotificationState { }


const initialState: AppState = {
    user: new User(),
    loggedOutUser: new User(),
    reimbursementRequests : [],
    reimbursmentRequest: new ReimbursmentRequest(),
    notifications: [],
    notification: new Notification(),
    notificationType: ''
}

const reducer = (state: AppState = initialState, action: AppAction) => {
    switch(action.type){
        case 'GET_USER':
            state.user = action.payload
            return state;
        case 'GET_LOGGED_OUT_USER':
            state.loggedOutUser = action.payload;
            return state;
        case 'ADD_REIMBURSMENT_REQUEST':
            state.reimbursementRequests = [...state.reimbursementRequests, action.payload];
            return state;
        case 'GET_REIMBURSMENT_REQUEST':
            state.reimbursmentRequest = action.payload as ReimbursmentRequest;
            return state;
        case 'GET_ALL_REIMBURSMENT_REQUESTS':
            state.reimbursementRequests = action.payload as ReimbursmentRequest[];
            return state;
        case 'GET_ALL_REIMBURSMENT_REQUESTS_BY_USER':
            state.reimbursementRequests = state.reimbursementRequests.filter(req => {
                return req.username === action.payload
            });
            return state;
        case 'CHANGE_REIMBURSMENT_REQUEST':
            state.reimbursmentRequest = action.payload as ReimbursmentRequest;
            return state;
        case 'CHANGE_NOTIFICATION':
            state.notification = action.payload as Notification;
            return state;
        case 'GET_ALL_NOTIFICATIONS':
            state.notifications = action.payload as Notification[];
            return state;
        case 'GET_NOTIFICATION':
            state.notification = action.payload as Notification;
            return state;
        default:
            return state;
    }
}

export default reducer;