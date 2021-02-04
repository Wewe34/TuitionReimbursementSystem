import { Notification } from '../../models/notification';

export const changeNotification = (notification: Notification) => {
    const action = {
        type: 'CHANGE_NOTIFICATION',
        payload: notification
    }
    return action;
}

export const getAllNotifications = (notifications: Notification[]) => {
    const action = {
        type: 'GET_ALL_NOTIFICATIONS',
        payload: notifications
    }
    return action;
}

export const getSingleNotification = (notification: Notification) => {
    const action = {
        type: 'GET_NOTIFICATION',
        payload: notification
    }
    return action;
}

export const getNotificationType = (notificationType: string) => {
    const action = {
        type: 'GET_NOTIFICATION_TYPE',
        payload: notificationType
    }
    return action;
}