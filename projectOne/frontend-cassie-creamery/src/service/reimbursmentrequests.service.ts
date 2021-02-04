import axios from 'axios';
import { ReimbursmentRequest } from '../models/reimbursmentrequests';

class ReimbursmentRequestService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/reimbursmentrequests';
    }

    reimbursmentRequestSubmit(reimbursmentRequest: ReimbursmentRequest): Promise<null> {
        return axios.post(this.URI, reimbursmentRequest, {withCredentials: true}).then(() => null);
    }

    getRequest(id: string): Promise<ReimbursmentRequest> {
        console.log('in service', id);
        return axios.get(this.URI+'/request/'+id).then((result) => result.data );
    }
    getAllRequests(): Promise<ReimbursmentRequest[]> {
        return axios.get(this.URI).then((result) => result.data );
    }

    getAllRequestsByUsername(username: string): Promise<ReimbursmentRequest[]> {
        return axios.get(this.URI+'/requests/'+username).then((result) => result.data );
    }

    updateRequest(r: ReimbursmentRequest): Promise<null> {
        return axios.put(this.URI, r).then(result => null);
    }
}

const reimbursmentRequestService =  new ReimbursmentRequestService();
export default reimbursmentRequestService;