import {ReimbursmentRequest} from '../../models/reimbursmentrequests';
import { User } from '../../models/user';

//type of ReimbursmentAction
export type ReimbursmentRequestAction = {
    type: string;
    payload: ReimbursmentRequest
}

export const addReimbursmentRequest = (reimbursmentRequest: ReimbursmentRequest) => {
    const action = {
        type: 'ADD_REIMBURSMENT_REQUEST',
        payload: reimbursmentRequest
    }
    return action;
}

export const getReimbursmentRequest = (reimbursmentRequest: ReimbursmentRequest) => {
    const action = {
        type: 'GET_REIMBURSMENT_REQUEST',
        payload: reimbursmentRequest
    }
    return action;
}

export const changeReimbursmentRequest = (reimbursmentRequest: ReimbursmentRequest) => {
    const action = {
        type: 'CHANGE_REIMBURSMENT_REQUEST',
        payload: reimbursmentRequest
    }
    return action;
}

export const getAllReimbursmentRequests = (reimbursmentRequests: ReimbursmentRequest[]) => {
    const action = {
        type: 'GET_ALL_REIMBURSMENT_REQUESTS',
        payload: reimbursmentRequests
    }
    return action;
}

export const getAllReimbursmentRequestsByUser = (user: User) => {
    const action = {
        type: 'GET_ALL_REIMBURSMENT_REQUESTS_BY_USER',
        payload: user
    }
    return action;
}