import reimbursmentRequestsService from '../service/reimbusmentrequests.service';
import express from 'express';
import logger from '../log';
import publicDir from '../constant';

const router = express.Router();


router.post('/', (req, res, next) => {
    logger.debug(req.body);
    reimbursmentRequestsService.addRequest(req.body).then((data)=> {
        logger.debug(data);
        res.sendStatus(201); // Created
    }).catch((err) => {
        logger.info('YOU SEE ME');
        logger.error(err);
        res.sendStatus(500); // Server error, sorry
    })
});

router.get('/request/:id', (req, res, next) => {
    console.log('req.params.id', req.params.id)
    reimbursmentRequestsService.getRequestById(req.params.id).then((results) => {
        res.send(results);
    }).catch((err) => {
        logger.error(err)
        res.sendStatus(500)
    })
})

router.get('/', function(req, res, next) {
    reimbursmentRequestsService.getAllRequests().then((requests) => {
        res.send(JSON.stringify(requests));
    });
});

router.get('/requests/:username', (req, res, next) => {
    console.log('req.params.id', req.params.id)
    reimbursmentRequestsService.getRequestById(req.params.username).then((requests) => {
        res.send(JSON.stringify(requests));
    }).catch((err) => {
        logger.error(err)
        res.sendStatus(500)
    })
})

router.put('/', (req, res, next) => {
    logger.debug(req.body);
    reimbursmentRequestsService.updateRequest(req.body).then((data)=> {
        res.send(data);
    })
})

export default router;