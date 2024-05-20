import { _decorator, Component, Node, EditBox, find, Button, director} from 'cc';
const { ccclass, property } = _decorator;
interface User{
    name: string;
    score: string;
}
@ccclass('signIn')
export class signIn extends Component {
    @property(EditBox) nameBox: EditBox = null;
    @property(EditBox) passwordBox: EditBox = null;
    
    @property(Array<User>) userList: User[] = [];
    onLoad(){
        this.nameBox.node.on('text-changed', this.textChange, this);
    }
    start() {
        
        const userRef = firebase.database().ref('users');
        userRef.once('value')
        .then((snapshot) => {
            // 获取快照中的所有子节点数据
            const userData = snapshot.val();
            // 在这里处理所有子节点数据
            // console.log(userData);
            // this.userList.push(userData);
            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    const user: User = userData[key];
                    this.userList.push(user);
                }
            }
            console.log(userData);
        })
        .catch((error) => {
            // 处理错误
            console.error(error);
        });

        let StartButton = new Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "signIn";
        StartButton.handler = "loadGameScene";
        find("Canvas/BG/StartBtn").getComponent(Button).clickEvents.push(StartButton);

    }

    update(deltaTime: number) {
        
    }
    textChange(){
        console.log(this.nameBox.string);
    }
    loadGameScene(){
        let data = {
            name: this.nameBox.string,
            score: this.passwordBox.string
        }
        console.log(data);
        if(this.userList.findIndex(user => user.name == this.nameBox.string && user.score == this.passwordBox.string) == -1){
            alert("wrong user");
            return;
        };
        // director.loadScene("ScoreBoard");
    }
    
}

