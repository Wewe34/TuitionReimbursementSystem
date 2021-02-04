import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import { ReimbursmentRequest } from '../models/reimbursmentrequest';


class ReimbursmentRequestsService {
    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    async addRequest(reimbursmentRequest: ReimbursmentRequest): Promise<boolean> {
        logger.debug('I am the reimbursement being sent to dynamo', reimbursmentRequest);
        const params = {
            TableName: 'reimbursement-requests',
            Item: reimbursmentRequest,
            ConditionExpression: '#id <> :id',
            ExpressionAttributeNames: {
                '#id': 'id',
            },
            ExpressionAttributeValues: {
                ':id': reimbursmentRequest.id
            }
        };

        logger.debug('i am the params', params);

        return await this.doc.put(params).promise().then((result) => {
            logger.info('Successfully created reimburstment request');
            return true;
        }).catch((error) => {
            logger.info('I AM HIT TONIGHT')
            logger.error('I am the erroe being thrown',error);
            return false;
        });
    }

    async getRequestById(id: string): Promise<ReimbursmentRequest|null> {
        const params = {
            TableName: 'reimbursement-requests',
            Key: {
                'id': id
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if(data && data.Item)
                return data.Item as ReimbursmentRequest;
            else
                return null;
        })
    }

    async updateRequest(request: ReimbursmentRequest): Promise<boolean> {
        const params = {
            TableName: 'reimbursement-requests',
            Key: {
                'id': request.id
            },
            UpdateExpression: 'set #s=:s, #ea=:ea, #eaf=:eaf, #eafr=:eafr, #gps=:gps',
            ExpressionAttributeValues: {
                ':s': request.status,
                ':ea': request.editAmt,
                ':eaf': request.exceedingAvailableFunds,
                ':eafr': request.exceedingAvailableFundsReason,
                ':gps': request.gradePresSubmission
            },
            ExpressionAttributeNames: {
                '#s': 'status',
                '#ea': 'editAmt',
                '#eaf': 'exceedingAvailableFunds',
                '#eafr': 'exceedingAvailableFundsReason',
                '#gps': 'gradePresSubmission'
            },
            ReturnValue: 'UPDATED_NEW'
        };

        return await this.doc.update(params).promise().then(() => {
            logger.info('Successfully updated reimbursement request');
            return true;
        }).catch((error) => {
            logger.error(error);
            return false;
        })
    }

    async getAllRequests(): Promise<ReimbursmentRequest[]> {
        const params = {
            TableName: 'reimbursement-requests',
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as ReimbursmentRequest[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

    async getRequestsByUsername(username: string): Promise<ReimbursmentRequest[]|null> {
        logger.debug('username',username);
        const params = {
            TableName: 'reimbursement-requests',
            FilterExpression: '#un = :un',
            ExpressionAttributeNames: {
                '#un': 'username'
            },
            ExpressionAttributeValues: {
                ':un': username
            }
        };
        return await this.doc.scan(params).promise().then((data) => {
            if(data && data.Items && data.Items.length){
                return data.Items as ReimbursmentRequest[];
            } else {
                return null;
            }
        })
    }
}

const reimbursmentRequestsService = new ReimbursmentRequestsService();
export default reimbursmentRequestsService;