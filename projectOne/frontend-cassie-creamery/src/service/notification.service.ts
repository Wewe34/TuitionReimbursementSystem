import axios from 'axios';
import { Notification } from '../models/notification';

class NotificationService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/notifications';
    }

    notificationSubmit(notification: Notification): Promise<null> {
        return axios.post(this.URI, notification, {withCredentials: true}).then(() => null);
    }

    getAllNotifications(username: string): Promise<Notification[]> {
        return axios.get(this.URI+'/'+username).then((result) => result.data );
    }

    getNotification(id: string): Promise<Notification> {
        console.log('in service', id);
        return axios.get(this.URI+'/notification/'+id).then((result) => result.data );
    }

    updateNotfication(n: Notification): Promise<null> {
        return axios.put(this.URI, n).then(result => null);
    }
}

const notificationService =  new NotificationService();
export default notificationService;