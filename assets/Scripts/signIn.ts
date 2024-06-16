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
    @property(Button) BackBtn: Button = null;

    
    // @property(Array<User>) userList: User[] = [];
    onLoad(){
        this.nameBox.node.on('text-changed', this.textChange, this);
    }
    start() {

        let StartButton = new Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "signIn";
        StartButton.handler = "loadGameScene";
        find("Canvas/BG/StartBtn").getComponent(Button).clickEvents.push(StartButton);

        let BackButton = new Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component = "signIn";
        BackButton.handler = "BackMenu";
        this.BackBtn.clickEvents.push(BackButton);
    }

    update(deltaTime: number) {
        
    }
    textChange(){
        console.log(this.nameBox.string);
    }
    BackMenu(){
        director.loadScene("Menu2");
    }
    loadGameScene(){
        firebase.auth().signInWithEmailAndPassword(this.nameBox.string, this.passwordBox.string)
            .then((userCredential) => {
                // 登录成功时执行的操作
                // 显示成功消息
                alert('Login successful!');
                // 清除输入字段
                // txtEmail.value = '';
                // txtPassword.value = '';
                
                // 重定向到另一个页面（例如 index.html）
            })
            .catch((error) => {
                // 处理登录失败的情况
                // 显示错误消息
                alert('Login failed. Please check your email and password.');
                // 清除输入字段
                // txtEmail.value = '';
                // txtPassword.value = '';
            });
        // let data = {
        //     name: this.nameBox.string,
        //     score: this.passwordBox.string
        // }
        // console.log(data);
        // if(this.userList.findIndex(user => user.name == this.nameBox.string && user.score == this.passwordBox.string) == -1){
        //     alert("wrong user");
        //     return;
        // };
        director.loadScene("Select");
    }
    
}

