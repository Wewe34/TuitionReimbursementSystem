import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import { Notification } from '../models/notification';


class NotificationService {
    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    async addNotification(notification: Notification): Promise<boolean> {
        logger.debug('I am the reimbursement being sent to dynamo', notification);
        const params = {
            TableName: 'notifications',
            Item: notification,
            ConditionExpression: '#id <> :id',
            ExpressionAttributeNames: {
                '#id': 'id',
            },
            ExpressionAttributeValues: {
                ':id': notification.id
            }
        };

        logger.debug('i am the params', params);

        return await this.doc.put(params).promise().then((result) => {
            logger.info('Successfully created notification');
            return true;
        }).catch((error) => {
            logger.error(error);
            return false;
        });
    }

    async getNotificationsByUsername(username: string): Promise<Notification[]|null> {
        logger.debug('username',username);
        const params = {
            TableName: 'notifications',
            FilterExpression: '#un = :un',
            ExpressionAttributeNames: {
                '#un': 'to'
            },
            ExpressionAttributeValues: {
                ':un': username
            }
        };
        return await this.doc.scan(params).promise().then((data) => {
            if(data && data.Items && data.Items.length){
                return data.Items as Notification[];
            } else {
                return null;
            }
        })
    }

    async getNotificationById(notificiationId: string): Promise<Notification|null> {
        const params = {
            TableName: 'notifications',
            Key: {
                'id': notificiationId
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if(data && data.Item)
                return data.Item as Notification;
            else
                return null;
        })
    }

    async updateNotification(notification: Notification): Promise<boolean> {
        const params = {
            TableName: 'notifications',
            Key: {
                'id': notification.id
            },
            UpdateExpression: 'set #t=:t, #h=:h, #sl=:sl, #m=:m, #f=:f',
            ExpressionAttributeValues: {
                ':t': notification.to,
                ':h': notification.handled,
                ':sl': notification.subjectLine,
                ':m': notification.message,
                ':f': notification.from
            },
            ExpressionAttributeNames: {
                '#t': 'to',
                '#h': 'handled',
                '#sl': 'subjectLine',
                '#m': 'message',
                '#f': 'from'
            },
            ReturnValue: 'UPDATED_NEW'
        };

        return await this.doc.update(params).promise().then(() => {
            logger.info('Successfully updated notification');
            return true;
        }).catch((error) => {
            logger.error(error);
            return false;
        })
    }
}

const notificationService = new NotificationService();
export default notificationService;