import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass('CreateUser')
export default class CreateUser extends cc.Component {
    // start() {

    // }

    makeid(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    writeUserData(userId, name, score) {
        firebase.database().ref('users/' + userId).set({
          name: name,
          score: score,
        });
    }

    onClick(){
        let name = this.makeid(7);
        let score = cc.randomRangeInt(0, 9999).toString();
        
        this.writeUserData(name, name, score);
        // cc.log(name);
        // cc.log(score);

    }

    // update(deltaTime: number) {
        
    // }
}


