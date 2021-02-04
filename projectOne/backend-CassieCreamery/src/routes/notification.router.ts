import notificationService from '../service/notification.service';
import express from 'express';
import logger from '../log';
import publicDir from '../constant';

const router = express.Router();


router.post('/', (req, res, next) => {
    logger.debug(req.body);
    notificationService.addNotification(req.body).then((data)=> {
        logger.debug(data);
        res.sendStatus(201);
    }).catch((err) => {
        logger.error(err);
        res.sendStatus(500);
    })
});

router.get('/:username', (req, res, next) => {
    console.log('req.params.username', req.params.username)
    notificationService.getNotificationsByUsername(req.params.username).then((results) => {
        res.send(results);
    }).catch((err) => {
        logger.error(err)
        res.sendStatus(500)
    })
})

router.get('/notification/:id', (req, res, next) => {
    console.log('req.params.id', req.params.id)
    notificationService.getNotificationById(req.params.id).then((results) => {
        res.send(results);
    }).catch((err) => {
        logger.error(err)
        res.sendStatus(500)
    })
})

router.put('/', (req, res, next) => {
    logger.debug(req.body);
    notificationService.updateNotification(req.body).then((data)=> {
        res.send(data);
    })
})

export default router;