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
        const currentUser = firebase.auth().currentUser;
        const usersRef = firebase.database().ref('users/' + currentUser.uid);
        // 2. 将帖子数据推送到数据库的 "com_list" 节点
        // var newPostRef = usersRef.push();
        let data = {
            name: na,
            email: mail,
            death: die,
            kill: ki,
            skin: "Knight"
        }
        usersRef.set(data)
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
        userRef.once('value')((snapshot) => {
            // 获取快照中的所有子节点数据
            const userData = snapshot.val();
            // 在这里处理所有子节点数据
            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    const user: User = userData[key];
                    this.userList.push(user);
                }
            }
            console.log(userData);
        }, (error) => {
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
        })
        .catch((error) => {
            alert(error.message);
        });     
    }
}

