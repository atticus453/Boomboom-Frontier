import { _decorator, Component, Node, Button, director, Prefab, instantiate, EditBox, AudioSource} from 'cc';
import { Setting } from './Setting';
const { ccclass, property } = _decorator;
export let backPage: number = 0;

@ccclass('Menu')
export class Menu extends Component {

    @property(Button) 
    setBtn: Button = null;

    @property(Button) 
    playBtn: Button = null;

    @property(Button) 
    logOutBtn: Button = null;

    @property(Button) 
    signInBtn: Button = null;
    
    @property(Button) 
    signUpBtn: Button = null;

    @property(Button) 
    leaderBoardBtn: Button = null;

    @property(Prefab)
    signInPrefab: Prefab = null;

    @property(Prefab)
    signUpPrefab: Prefab = null;

    @property(Prefab)
    settingPrefab: Prefab = null;


    static isLogin: boolean = false;
    private isLoginSet: Node = null;
    private isNotLoginSet: Node = null;

    start() {
        this.isLoginSet = this.node.getChildByName("isLogInSet");
        this.isNotLoginSet = this.node.getChildByName("isnotLogInSet");
        this.playBtn.node.on(Node.EventType.MOUSE_UP, this.onPlayClick, this);
        this.setBtn.node.on(Node.EventType.MOUSE_UP, this.onSetClick, this);
        this.logOutBtn.node.on(Node.EventType.MOUSE_UP, this.LogOut, this);
        this.signInBtn.node.on(Node.EventType.MOUSE_UP, this.onSignInClick, this);
        this.signUpBtn.node.on(Node.EventType.MOUSE_UP, this.onSignUpClick, this);
        this.leaderBoardBtn.node.on(Node.EventType.MOUSE_UP, this.onleaderBoardClick, this);
    }

    onSetClick(){
        // backPage = 1;
        // director.loadScene("Setting");
        let setting = instantiate(this.settingPrefab);
        this.node.addChild(setting);
    }

    onPlayClick(){
        director.loadScene("MultiSelect");
    }

    LogOut(){
        firebase.auth().signOut().then(() => {
            // Menu.isLogin = true;
        });
    }

    onleaderBoardClick(){
        director.loadScene("ScoreBoard");
    }

    onSignInClick(){
        console.log("Sign In...");
        let signIn = instantiate(this.signInPrefab);
        signIn.setPosition(0, 0);
        signIn.getChildByName("cancel").on(Button.EventType.CLICK, ()=>{
            signIn.destroy();
        }, this);
        this.node.addChild(signIn);
        let emailBox = signIn.getChildByName("email").getComponent(EditBox);
        let pswdBox = signIn.getChildByName("pswd").getComponent(EditBox);
        signIn.getChildByName("startButton").on(Button.EventType.CLICK, ()=>{
            firebase.auth().signInWithEmailAndPassword(emailBox.string, pswdBox.string)
            .then((userCredential) => {
                alert('Login successful!');
                signIn.destroy();
            })
            .catch((error) => {
                alert('Login failed. Please check your email and password.');
            });
        }, this);
    }

    onSignUpClick(){
        console.log("Sign Up...");
        let signUp = instantiate(this.signUpPrefab);
        signUp.setPosition(0, 0);
        signUp.getChildByName("cancel").on(Button.EventType.CLICK, ()=>{
            signUp.destroy();
        }, this);
        this.node.addChild(signUp);
        let nameBox = signUp.getChildByName("name").getComponent(EditBox);
        let emailBox = signUp.getChildByName("email").getComponent(EditBox);
        let pswdBox = signUp.getChildByName("pswd").getComponent(EditBox);
        signUp.getChildByName("startButton").on(Button.EventType.CLICK, ()=>{
            firebase.auth().createUserWithEmailAndPassword(emailBox.string, pswdBox.string)
            .then((userCredential) => {
                this.writeUserData(emailBox.string, nameBox.string, 0, 0);
                alert('Signup successful.');
                signUp.destroy();
            })
            .catch((error) => {
                alert(error.message);
            }); 
        }, this);
    }

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
        usersRef.set(data).then(function() {
            console.log("Post successfully added to database.");
        }).catch(function(error) {
            console.error("Error adding post to database: ", error);
        });
    }

    update(deltaTime: number) {
        var user = firebase.auth().currentUser;
        // console.log("user", user);
        this.isLoginSet.active = user ? true : false;
        this.isNotLoginSet.active = user ? false : true;

        this.getComponent(AudioSource).volume = Setting.BGMvolume * 2;
        console.log(Setting.BGMvolume);
    }
}

