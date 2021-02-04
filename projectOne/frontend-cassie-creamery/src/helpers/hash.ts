export function hashVal(){
    let hashString: string =
    '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let hashVal : any;

    for (let i = 0; i < 10; i++) {
        hashVal = '';
        for (let j = 0; j < 12; j++) {
        hashVal += hashString[Math.floor(Math.random() * hashString.length)];
        }
    }
    return hashVal;
}
