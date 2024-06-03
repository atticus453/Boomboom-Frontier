import { _decorator, Component, Node , Button, director, AudioClip} from 'cc';
import BGManager from './Manager/BGManager';
const { ccclass, property } = _decorator;

@ccclass('menu')
export class menu extends Component {
    @property(Button) setBtn: Button = null;
    
    @property(Button) signUpBtn: Button = null;
    @property(Button) signInBtn: Button = null;
    @property(AudioClip)
    static bgm: AudioClip = null;
    
    // @property(Button) signOutBtn: Button = null;
    start() {
        BGManager.playMusic();

        let SetButton = new Component.EventHandler();
        SetButton.target = this.node;
        SetButton.component = "menu";
        SetButton.handler = "LoadSet";
        this.setBtn.clickEvents.push(SetButton);

        let SignInButton = new Component.EventHandler();
        SignInButton.target = this.node;
        SignInButton.component = "menu";
        SignInButton.handler = "loadSignIn";
        this.signInBtn.clickEvents.push(SignInButton);

        let SignupButton = new Component.EventHandler();
        SignupButton.target = this.node;
        SignupButton.component = "menu";
        SignupButton.handler = "loadSignUp";
        this.signUpBtn.clickEvents.push(SignupButton);

        // let SignOutButton = new Component.EventHandler();
        // SignOutButton.target = this.node;
        // SignOutButton.component = "menu";
        // SignOutButton.handler = "LogOut";
        // this.signOutBtn.clickEvents.push(SignOutButton);
    }

    loadSignIn(){
        director.loadScene("signIn");
    }
    loadSignUp(){
        director.loadScene("signUp");
    }
    LoadSet(){
        director.loadScene("Setting")
    }
    LogOut(){

    }
    
    update(deltaTime: number) {
        
    }
}

