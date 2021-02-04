import * as user from '../models/user';
import express from 'express';
import logger from '../log';
import publicDir from '../constant';
import userService from '../service/user.service';

const router = express.Router();

router.get('/login', function(req: any, res, next) {
    //am I logged in?
    logger.debug('trying to get the req', req);
    if(req.session.user) {
      console.log(req.session.user);
      res.redirect('/');
    }
    res.sendFile('login.html', {root: publicDir});
  });

  router.get('/', (req: any, res, next) => {
    let u = {...req.session.user};
    logger.debug(u);
    res.send(JSON.stringify(u));
  });

  router.delete('/', (req, res, next) => {
    req.session.destroy((err) => logger.error(err));
    res.sendStatus(204);
  })

  router.post('/', function(req: any, res, next) {
    logger.debug(req.body);
    user.login(req.body.name, req.body.password).then((user) => {
      if(user === null) {
        res.sendStatus(401);
      }
      req.session.user = user;
      res.send(JSON.stringify(user))
    });
  });

  router.put('/', (req, res, next) => {
    logger.debug(req.body);
    userService.updateUser(req.body).then((data)=> {
        res.send(data);
    })
})

router.get('/:username', (req,res, next) => {
  userService.getUserByUsername(req.params.username).then((user) => {
    if (user === null){
      res.sendStatus(404);
    }
    res.send(user);
  })
})

export default router;