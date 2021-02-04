import * as AWS from 'aws-sdk';
import userService from '../service/user.service';


// Set the region
AWS.config.update({ region: 'us-east-2' });

// Create a DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const removeUsers = {
    TableName: 'users'
}

const removeReimbursmentRequests = {
    TableName: 'reimbursment-requests'
}

const removeNotification = {
    TableName: 'notifications'
}

const userSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

const reimbursmentRequestsSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'reimbursement-requests',
    StreamSpecification: {
        StreamEnabled: false
    }
};

const notificationSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'notifications',
    StreamSpecification: {
        StreamEnabled: false
    }
};


ddb.deleteTable(removeUsers, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(userSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateUserTable();
                }, 10000);
            }
        });
    }, 5000);
});

ddb.deleteTable(removeReimbursmentRequests, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(reimbursmentRequestsSchema, (err, data) => {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Table Created', data);
            }
        });
    }, 5000);
});

ddb.deleteTable(removeNotification, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(notificationSchema, (err, data) => {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Table Created', data);
            }
        });
    }, 5000);
});

function populateUserTable() {
    userService.addUser({username: 'energie', password: 'pass', role: 'employee', supervisor: 'scott', benCo:'bri', availReim: 1000}).then(()=>{});
    userService.addUser({username: 'chante', password: 'pass', role: 'employee', supervisor: 'jr', benCo:'bri', availReim: 1000}).then(()=>{});
    userService.addUser({username: 'serenity', password: 'pass', role: 'employee', supervisor: 'jeff', benCo:'bri', availReim: 1000}).then(()=>{});
    userService.addUser({username: 'scott', password: 'pass', role: 'supervisor',  deptHead: 'sammy', benCo:'bri',}).then(()=>{});
    userService.addUser({username: 'jeff', password: 'pass', role: 'supervisor',  deptHead: 'jeff', benCo:'bri',}).then(()=>{});
    userService.addUser({username: 'jr', password: 'pass', role: 'supervisor',  deptHead: 'brandon', benCo:'bri',}).then(()=>{});
    userService.addUser({username: 'sammy', password: 'pass', role: 'deptHead', benCo:'bri',}).then(()=>{});
    userService.addUser({username: 'brandon', password: 'pass', role: 'deptHead', benCo:'bri',}).then(()=>{});
    userService.addUser({username: 'bri', password: 'pass', role: 'benCo'}).then(()=>{});
}

