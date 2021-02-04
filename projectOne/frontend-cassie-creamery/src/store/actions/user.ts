import {User} from '../../models/user';

//type of UserAction
export type UserAction = {
    type: string;
    payload: User
}

export const getUser = (user: User) => {
    const action = {
        type: 'GET_USER',
        payload: user
    }
    return action;
}

export const getLoggedOutUser = (user: User) => {
    const action = {
        type: 'GET_LOGGED_OUT_USER',
        payload: user
    }
    return action;
}
