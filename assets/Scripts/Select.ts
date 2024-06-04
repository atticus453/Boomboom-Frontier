import { _decorator, Component, Node, Button, director} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Select')
export class Select extends Component {
    @property(Button) setBtn: Button = null;
    @property(Button) singleBtn: Button = null;
    @property(Button) multiBtn: Button = null;
    @property(Button) signOutBtn: Button = null;

    static backPage: number = 0;
    start() {
        let SetButton = new Component.EventHandler();
        SetButton.target = this.node;
        SetButton.component = "Select";
        SetButton.handler = "LoadSet";
        this.setBtn.clickEvents.push(SetButton);

        let SingleButton = new Component.EventHandler();
        SingleButton.target = this.node;
        SingleButton.component = "Select";
        SingleButton.handler = "LoadSingle";
        this.singleBtn.clickEvents.push(SingleButton);

        let MultiButton = new Component.EventHandler();
        MultiButton.target = this.node;
        MultiButton.component = "Select";
        MultiButton.handler = "LoadMulti";
        this.multiBtn.clickEvents.push(MultiButton);

        let SignOutButton = new Component.EventHandler();
        SignOutButton.target = this.node;
        SignOutButton.component = "Select";
        SignOutButton.handler = "LogOut";
        this.signOutBtn.clickEvents.push(SignOutButton);
    }
    LoadSet(){
        Select.backPage = 1;
        director.loadScene("Setting");
    }
    LoadMulti(){
        director.loadScene("MultiSelect");
    }
    LoadSingle(){
        director.loadScene("Game");
    }
    LogOut(){
        firebase.auth().signOut().then(() => {
            director.loadScene("Menu");
        });
    }

    update(deltaTime: number) {
        
    }
}

