import logger from '../log';
import userService from '../service/user.service';

export class User {

    constructor(public username: string,
                public password: string,
                public role: string,
                public supervisor?: string,
                public deptHead?: string,
                public benCo?: string,
                public availReim?: number) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.supervisor = supervisor;
        if (availReim) {
            this.availReim = availReim;
        }
        if (supervisor) {
            this.supervisor = supervisor;
        }
        if (deptHead) {
            this.deptHead = deptHead;
        }
        if (benCo) {
            this.benCo = benCo;
        }
    };
}


export async function login(username: string, password: string): Promise<User|null> {
    logger.debug(`${username +' '+ password}`);
    return await userService.getUserByUsername(username).then((user)=> {
        if (user && user.password === password) {
            return user
        } else {
            return null;
        }
    })
}

