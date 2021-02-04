import axios from 'axios';
import { User} from '../models/user';

class UserService {
    private URI: string;
    constructor() {
        this.URI = 'http://localhost:3000/users';
    }
    getLogin(): Promise<User> {
        return axios.get(this.URI, {withCredentials: true}).then(result=>{
            console.log('Im inside getLogin. after get req',result);
            return result.data
        });
    }

    login(user: User): Promise<User> {
        return axios.post(this.URI, user, {withCredentials: true}).then(result => result.data);
    }
    logout(): Promise<null> {
        return axios.delete(this.URI, {withCredentials: true}).then(result => null);
    }

    updateUserAmt(u: User): Promise<null> {
        return axios.put(this.URI,u).then(result => null);
    }

    getUser(u: string): Promise<User> {
        return axios.get(this.URI+'/'+u).then(result => result.data);
    }
}

export default new UserService();