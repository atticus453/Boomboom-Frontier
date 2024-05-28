import { _decorator, Component, Node, EditBox, find, Button, director } from 'cc';
const { ccclass, property } = _decorator;

interface User{
    name: string;
    score: string;
}
@ccclass('signUp')
export class signUp extends Component {
    @property(EditBox) nameBox: EditBox = null;
    @property(EditBox) passwordBox: EditBox = null;
    @property(EditBox) emailBox: EditBox = null;
    @property(Button) BackBtn: Button = null;

    @property(Array<User>) userList: User[] = [];
    writeUserData(mail, na, die, ki) {
        const comListRef = firebase.database().ref('users');
        // 2. 将帖子数据推送到数据库的 "com_list" 节点
        var newPostRef = comListRef.push();
        let data = {
            name: na,
            email: mail,
            death: die,
            kill: ki
        }
        newPostRef.set(data)
            .then(function() {
                console.log("Post successfully added to database.");
            })
            .catch(function(error) {
                console.error("Error adding post to database: ", error);
            });
    }
    onLoad(){
        this.nameBox.node.on('text-changed', this.textChange, this);
    }
    start() {
        let StartButton = new Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "signUp";
        StartButton.handler = "loadGameScene";
        find("Canvas/BG/StartBtn").getComponent(Button).clickEvents.push(StartButton);

        let BackButton = new Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component = "signUp";
        BackButton.handler = "BackMenu";
        this.BackBtn.clickEvents.push(BackButton);

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
        if(this.userList.findIndex(user => user.name == this.nameBox.string) != -1){
            alert("username has been used");
            return;
        };
        firebase.auth().createUserWithEmailAndPassword(this.emailBox.string, this.passwordBox.string)
        .then((userCredential) => {
            // 注册成功
            // addUser(txtName.value, txtEmail.value);
            this.writeUserData(this.emailBox.string, this.nameBox.string, 0, 0);
            alert('Signup successful.');
            director.loadScene("Select");
            // 清空输入字段
            // txtEmail.value = '';
            // txtPassword.value = '';
            // txtName.value = '';
        })
        .catch((error) => {
            // 注册失败
            alert(error.message);
            // 清空输入字段
            // txtEmail.value = '';
            // txtPassword.value = '';
            // txtName.value = '';
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
        
    }
}

